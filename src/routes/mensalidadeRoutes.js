const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const statuses = new Set(['Pendente', 'Vencida', 'Pago']);

function validationError(message) {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
}

function parseMoney(value, fieldName) {
    const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
    if (!Number.isFinite(number) || number <= 0) {
        throw validationError(`${fieldName} deve ser maior que zero.`);
    }
    return Math.round(number * 100) / 100;
}

function parseCompetence(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}$/.test(value)) {
        throw validationError('Informe uma competência no formato AAAA-MM.');
    }
    const [year, month] = value.split('-').map(Number);
    if (month < 1 || month > 12) throw validationError('A competência informada é inválida.');
    return `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-01`;
}

function parseDueDay(value) {
    const day = typeof value === 'string' && value.trim() !== '' ? Number(value) : value;
    if (!Number.isInteger(day) || day < 1 || day > 31) {
        throw validationError('O dia do vencimento deve estar entre 1 e 31.');
    }
    return day;
}

function parsePastOrToday(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw validationError('Informe uma data de pagamento válida.');
    }
    const paymentDate = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(paymentDate.getTime()) || paymentDate.toISOString().slice(0, 10) !== value) {
        throw validationError('Informe uma data de pagamento válida.');
    }
    const today = new Date();
    const todayText = today.toISOString().slice(0, 10);
    if (value > todayText) throw validationError('A data de pagamento não pode ser futura.');
    return value;
}

function effectiveDueDate(competence, dueDay) {
    const [year, month] = competence.split('-').map(Number);
    const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
    return `${competence.slice(0, 8)}${String(Math.min(dueDay, lastDay)).padStart(2, '0')}`;
}

function currentStatus(charge) {
    if (charge.status === 'Pago') return 'Pago';
    return new Date(`${effectiveDueDate(charge.competencia, charge.dia_vencimento)}T23:59:59Z`) < new Date()
        ? 'Vencida'
        : 'Pendente';
}

function withDerivedStatus(charge) {
    const status = currentStatus(charge);
    return {
        ...charge,
        status,
        pago_em_atraso: charge.status === 'Pago'
            ? charge.data_pagamento > effectiveDueDate(charge.competencia, charge.dia_vencimento)
            : false
    };
}

function logFinancialError(operation, error) {
    console.error(`[financeiro] ${operation}: ${error.message || 'erro desconhecido'}`);
}

function handleError(res, operation, error) {
    logFinancialError(operation, error);
    if (error.code === '42P01' || error.code === 'PGRST205') {
        return res.status(503).json({ error: 'Controle financeiro indisponível. A tabela de mensalidades ainda não foi configurada.' });
    }
    const statusCode = error.statusCode || (error.code === '23505' ? 409 : 500);
    const message = error.code === '23505'
        ? 'Já existe uma mensalidade para este aluno e competência.'
        : error.statusCode
            ? error.message
            : 'Não foi possível concluir a operação financeira.';
    return res.status(statusCode).json({ error: message });
}

router.use(authMiddleware);

router.get('/mensalidades', async (req, res) => {
    try {
        const { aluno_id: studentId, competencia, status } = req.query;
        if (competencia !== undefined) parseCompetence(competencia);
        if (status !== undefined && !statuses.has(status)) {
            throw validationError('O status informado é inválido.');
        }

        let query = supabase.from('mensalidades').select('*').eq('proprietario_id', req.user.id).order('competencia', { ascending: false });
        if (studentId) query = query.eq('aluno_id', studentId);
        if (competencia) query = query.eq('competencia', parseCompetence(competencia));
        const { data, error } = await query;
        if (error) throw error;

        const charges = data.map(withDerivedStatus);
        return res.status(200).json(status ? charges.filter((charge) => charge.status === status) : charges);
    } catch (error) {
        return handleError(res, 'listar mensalidades', error);
    }
});

router.post('/mensalidades', async (req, res) => {
    try {
        const alunoId = String(req.body.aluno_id || '').trim();
        if (!alunoId) throw validationError('Selecione um aluno.');
        const competencia = parseCompetence(req.body.competencia);
        const valor = parseMoney(req.body.valor, 'O valor');
        const diaVencimento = parseDueDay(req.body.dia_vencimento);

        const { data: student, error: studentError } = await supabase
            .from('alunos')
            .select('id, nome, escola')
            .eq('id', alunoId).eq('proprietario_id', req.user.id)
            .maybeSingle();
        if (studentError) throw studentError;
        if (!student) return res.status(404).json({ error: 'Aluno não encontrado.' });

        const { data, error } = await supabase
            .from('mensalidades')
            .insert([{
                aluno_id: student.id,
                aluno_nome: student.nome,
                escola: student.escola,
                proprietario_id: req.user.id,
                competencia,
                valor,
                dia_vencimento: diaVencimento,
                status: 'Pendente'
            }])
            .select()
            .single();
        if (error) throw error;
        return res.status(201).json(withDerivedStatus(data));
    } catch (error) {
        return handleError(res, 'criar mensalidade', error);
    }
});

router.put('/mensalidades/:id/pagamento', async (req, res) => {
    try {
        const paymentDate = parsePastOrToday(req.body.data_pagamento);
        const paymentValue = parseMoney(req.body.valor_pago, 'O valor recebido');
        const { data: charge, error: findError } = await supabase
            .from('mensalidades')
            .select('*')
            .eq('id', req.params.id)
            .eq('proprietario_id', req.user.id)
            .maybeSingle();
        if (findError) throw findError;
        if (!charge) return res.status(404).json({ error: 'Mensalidade não encontrada.' });
        if (charge.status === 'Pago') throw validationError('Esta mensalidade já foi paga.');
        if (paymentValue !== Number(charge.valor)) {
            throw validationError('O valor recebido deve ser igual ao valor da mensalidade.');
        }

        const { data, error } = await supabase
            .from('mensalidades')
            .update({
                status: 'Pago',
                data_pagamento: paymentDate,
                valor_pago: paymentValue,
                pago_em_atraso: paymentDate > effectiveDueDate(charge.competencia, charge.dia_vencimento),
                updated_at: new Date().toISOString()
            })
            .eq('id', req.params.id)
            .eq('proprietario_id', req.user.id)
            .eq('status', 'Pendente')
            .select()
            .maybeSingle();
        if (error) throw error;
        if (!data) throw validationError('Esta mensalidade já foi paga.');
        return res.status(200).json(withDerivedStatus(data));
    } catch (error) {
        return handleError(res, 'registrar pagamento', error);
    }
});

module.exports = router;
