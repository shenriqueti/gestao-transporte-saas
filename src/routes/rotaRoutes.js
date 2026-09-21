const express = require('express');
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();
const boardingStatuses = new Set(['Pendente', 'Embarcou', 'Faltou', 'Não utilizará']);

function validationError(message) {
    const error = new Error(message);
    error.statusCode = 400;
    return error;
}

function parseDate(value, field = 'data') {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        throw validationError(`Informe ${field} no formato AAAA-MM-DD.`);
    }
    const parsed = new Date(`${value}T00:00:00Z`);
    if (Number.isNaN(parsed.getTime()) || parsed.toISOString().slice(0, 10) !== value) {
        throw validationError(`Informe ${field} válida.`);
    }
    return value;
}

function assertNotFuture(value) {
    const today = new Date().toISOString().slice(0, 10);
    if (value > today) throw validationError('O embarque não pode ser confirmado para uma data futura.');
}

function routePayload(body) {
    const nome = typeof body.nome === 'string' ? body.nome.trim() : '';
    if (!nome) throw validationError('Informe o nome da rota.');
    return {
        nome,
        descricao: typeof body.descricao === 'string' ? body.descricao.trim() || null : null,
        ...(typeof body.ativa === 'boolean' ? { ativa: body.ativa } : {})
    };
}

function logRouteError(operation, error) {
    console.error(`[rotas] ${operation}: ${error.message || 'erro desconhecido'}`);
}

function handleError(res, operation, error) {
    logRouteError(operation, error);
    if (error.code === '42P01' || error.code === 'PGRST205') {
        return res.status(503).json({ error: 'Gestão de rotas indisponível. A migração ainda não foi configurada.' });
    }
    const statusCode = error.statusCode || (error.code === '23505' ? 409 : 500);
    const message = error.code === '23505'
        ? 'Este registro já existe.'
        : error.statusCode ? error.message : 'Não foi possível concluir a operação de rota.';
    return res.status(statusCode).json({ error: message });
}

async function getRoute(routeId, userId) {
    const { data, error } = await supabase.from('rotas').select('*')
        .eq('id', routeId).eq('proprietario_id', userId).maybeSingle();
    if (error) throw error;
    if (!data) {
        const notFound = new Error('Rota não encontrada.');
        notFound.statusCode = 404;
        throw notFound;
    }
    return data;
}

router.use(authMiddleware);

router.get('/rotas', async (req, res) => {
    try {
        const includeInactive = req.query.inativas === 'true';
        let query = supabase.from('rotas').select('*').eq('proprietario_id', req.user.id).order('nome');
        if (!includeInactive) query = query.eq('ativa', true);
        const { data, error } = await query;
        if (error) throw error;
        const routes = await Promise.all(data.map(async (route) => {
            const { count, error: countError } = await supabase
                .from('rota_alunos').select('id', { count: 'exact', head: true }).eq('rota_id', route.id);
            if (countError) throw countError;
            return { ...route, passageiros_count: count || 0 };
        }));
        return res.json(routes);
    } catch (error) {
        return handleError(res, 'listar rotas', error);
    }
});

router.post('/rotas', async (req, res) => {
    try {
        const { data, error } = await supabase.from('rotas')
            .insert([{ ...routePayload(req.body), proprietario_id: req.user.id }]).select().single();
        if (error) throw error;
        return res.status(201).json(data);
    } catch (error) {
        return handleError(res, 'criar rota', error);
    }
});

router.put('/rotas/:id', async (req, res) => {
    try {
        await getRoute(req.params.id, req.user.id);
        const { data, error } = await supabase.from('rotas')
            .update({ ...routePayload(req.body), updated_at: new Date().toISOString() })
            .eq('id', req.params.id).select().single();
        if (error) throw error;
        return res.json(data);
    } catch (error) {
        return handleError(res, 'editar rota', error);
    }
});

router.delete('/rotas/:id', async (req, res) => {
    try {
        await getRoute(req.params.id, req.user.id);
        const { error } = await supabase.from('rotas')
            .update({ ativa: false, updated_at: new Date().toISOString() }).eq('id', req.params.id);
        if (error) throw error;
        return res.status(204).send();
    } catch (error) {
        return handleError(res, 'desativar rota', error);
    }
});

router.get('/rotas/:id/alunos', async (req, res) => {
    try {
        await getRoute(req.params.id, req.user.id);
        const { data, error } = await supabase.from('rota_alunos').select('*')
            .eq('rota_id', req.params.id).order('ordem');
        if (error) throw error;
        return res.json(data);
    } catch (error) {
        return handleError(res, 'listar passageiros da rota', error);
    }
});

router.post('/rotas/:id/alunos', async (req, res) => {
    try {
        await getRoute(req.params.id, req.user.id);
        const alunoId = String(req.body.aluno_id || '').trim();
        if (!alunoId) throw validationError('Selecione um aluno.');
        const { data: student, error: studentError } = await supabase.from('alunos')
            .select('id, nome, escola').eq('id', alunoId).eq('proprietario_id', req.user.id).maybeSingle();
        if (studentError) throw studentError;
        if (!student) {
            const error = new Error('Aluno não encontrado.');
            error.statusCode = 404;
            throw error;
        }
        const { count, error: countError } = await supabase.from('rota_alunos')
            .select('id', { count: 'exact', head: true }).eq('rota_id', req.params.id);
        if (countError) throw countError;
        const { data, error } = await supabase.from('rota_alunos').insert([{
            rota_id: req.params.id, aluno_id: student.id, aluno_nome: student.nome,
            escola: student.escola, ordem: (count || 0) + 1
        }]).select().single();
        if (error) throw error;
        return res.status(201).json(data);
    } catch (error) {
        return handleError(res, 'associar passageiro', error);
    }
});

router.delete('/rotas/:id/alunos/:alunoId', async (req, res) => {
    try {
        const { error } = await supabase.from('rota_alunos')
            .delete().eq('rota_id', req.params.id).eq('aluno_id', req.params.alunoId);
        if (error) throw error;
        return res.status(204).send();
    } catch (error) {
        return handleError(res, 'remover passageiro da rota', error);
    }
});

router.put('/rotas/:id/alunos/ordem', async (req, res) => {
    try {
        await getRoute(req.params.id, req.user.id);
        const ids = req.body.aluno_ids;
        if (!Array.isArray(ids) || ids.length === 0 || new Set(ids).size !== ids.length) {
            throw validationError('Informe a lista completa de alunos, sem repetições.');
        }
        const { data: current, error: currentError } = await supabase.from('rota_alunos')
            .select('id, aluno_id').eq('rota_id', req.params.id).order('ordem');
        if (currentError) throw currentError;
        if (current.length !== ids.length || current.some((item) => !ids.includes(item.aluno_id))) {
            throw validationError('A ordem deve conter exatamente os alunos da rota.');
        }
        for (const item of current) {
            const { error } = await supabase.from('rota_alunos').update({ ordem: item.ordem + 100000 }).eq('id', item.id);
            if (error) throw error;
        }
        for (const [index, alunoId] of ids.entries()) {
            const { error } = await supabase.from('rota_alunos')
                .update({ ordem: index + 1 }).eq('rota_id', req.params.id).eq('aluno_id', alunoId);
            if (error) throw error;
        }
        const { data, error } = await supabase.from('rota_alunos').select('*')
            .eq('rota_id', req.params.id).order('ordem');
        if (error) throw error;
        return res.json(data);
    } catch (error) {
        return handleError(res, 'ordenar passageiros', error);
    }
});

router.get('/rotas/:id/embarques', async (req, res) => {
    try {
        const route = await getRoute(req.params.id, req.user.id);
        const date = parseDate(req.query.data || new Date().toISOString().slice(0, 10));
        const { data: passengers, error: passengerError } = await supabase.from('rota_alunos')
            .select('*').eq('rota_id', route.id).order('ordem');
        if (passengerError) throw passengerError;
        const { data: records, error: recordError } = await supabase.from('embarques_diarios')
            .select('*').eq('rota_id', route.id).eq('data_embarque', date);
        if (recordError) throw recordError;
        const byPassenger = new Map(records.map((record) => [record.rota_aluno_id, record]));
        return res.json(passengers.map((passenger) => ({
            ...passenger,
            status: byPassenger.get(passenger.id)?.status || 'Pendente',
            confirmado_em: byPassenger.get(passenger.id)?.confirmado_em || null,
            confirmado_por: byPassenger.get(passenger.id)?.confirmado_por || null
        })));
    } catch (error) {
        return handleError(res, 'listar embarques', error);
    }
});

router.put('/rotas/:id/embarques/:alunoId', async (req, res) => {
    try {
        const date = parseDate(req.body.data);
        assertNotFuture(date);
        if (!boardingStatuses.has(req.body.status)) throw validationError('O estado de embarque é inválido.');
        const { data: passenger, error: passengerError } = await supabase.from('rota_alunos')
            .select('*').eq('rota_id', req.params.id).eq('aluno_id', req.params.alunoId).maybeSingle();
        if (passengerError) throw passengerError;
        if (!passenger) {
            const error = new Error('Passageiro não encontrado nesta rota.');
            error.statusCode = 404;
            throw error;
        }
        const payload = {
            rota_id: req.params.id, rota_aluno_id: passenger.id, aluno_id: passenger.aluno_id,
            aluno_nome: passenger.aluno_nome, escola: passenger.escola, data_embarque: date,
            status: req.body.status, confirmado_em: new Date().toISOString(), confirmado_por: req.user.id,
            updated_at: new Date().toISOString()
        };
        const { data, error } = await supabase.from('embarques_diarios')
            .upsert(payload, { onConflict: 'rota_aluno_id,data_embarque' }).select().single();
        if (error) throw error;
        return res.json(data);
    } catch (error) {
        return handleError(res, 'registrar embarque', error);
    }
});

router.get('/embarques', async (req, res) => {
    try {
        let query = supabase.from('embarques_diarios').select('*').order('data_embarque', { ascending: false });
        if (req.query.rota_id) {
            await getRoute(req.query.rota_id, req.user.id);
            query = query.eq('rota_id', req.query.rota_id);
        } else {
            const { data: ownedRoutes, error: routeError } = await supabase.from('rotas')
                .select('id').eq('proprietario_id', req.user.id);
            if (routeError) throw routeError;
            query = query.in('rota_id', ownedRoutes.map((route) => route.id));
        }
        if (req.query.aluno_id) query = query.eq('aluno_id', req.query.aluno_id);
        if (req.query.data_inicio) query = query.gte('data_embarque', parseDate(req.query.data_inicio, 'data inicial'));
        if (req.query.data_fim) query = query.lte('data_embarque', parseDate(req.query.data_fim, 'data final'));
        const { data, error } = await query;
        if (error) throw error;
        return res.json(data);
    } catch (error) {
        return handleError(res, 'consultar histórico', error);
    }
});

module.exports = router;
