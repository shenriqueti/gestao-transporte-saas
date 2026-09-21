const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');
const authMiddleware = require('../middleware/authMiddleware');

const studentFields = [
    'nome',
    'escola',
    'valor',
    'vencimento',
    'turma',
    'professora',
    'responsavel',
    'telefone'
];
const numericFields = new Set(['valor', 'vencimento']);

function normalize(value, field) {
    if (typeof value === 'string') {
        const trimmed = value.trim();
        return numericFields.has(field) && trimmed !== '' ? Number(trimmed) : trimmed;
    }
    return value;
}

function studentPayload(body) {
    return Object.fromEntries(studentFields.map((field) => [
        field,
        normalize(body[field], field)
    ]));
}

// Listar todos os alunos
router.get('/alunos', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase.from('alunos').select('*').eq('proprietario_id', req.user.id);
        
        if (error) throw error;
        
        return res.status(200).json(data);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// Cadastrar um novo aluno
router.post('/alunos', authMiddleware, async (req, res) => {
    try {
        const payload = studentPayload(req.body);
        const { nome, escola, responsavel, telefone } = payload;

        const { data: existingStudents, error: duplicateCheckError } = await supabase
            .from('alunos')
            .select('*')
            .eq('nome', nome)
            .eq('escola', escola)
            .eq('responsavel', responsavel)
            .eq('telefone', telefone)
            .eq('proprietario_id', req.user.id);

        if (duplicateCheckError) throw duplicateCheckError;

        const duplicate = existingStudents.some((student) =>
            studentFields.every((field) => normalize(student[field], field) === payload[field])
        );

        if (duplicate) {
            return res.status(409).json({ error: 'Este aluno já está cadastrado.' });
        }

        const { data, error } = await supabase
            .from('alunos')
            .insert([{ ...payload, proprietario_id: req.user.id }])
            .select();

        if (error) throw error;

        return res.status(201).json({ message: "Aluno cadastrado com sucesso!", data });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

router.put('/alunos/:id', authMiddleware, async (req, res) => {
    try {
        const payload = studentPayload(req.body);
        const { data: existingStudents, error: duplicateCheckError } = await supabase
            .from('alunos')
            .select('*')
            .eq('nome', payload.nome)
            .eq('escola', payload.escola)
            .eq('responsavel', payload.responsavel)
            .eq('telefone', payload.telefone)
            .neq('id', req.params.id)
            .eq('proprietario_id', req.user.id);

        if (duplicateCheckError) throw duplicateCheckError;

        const duplicate = existingStudents.some((student) =>
            studentFields.every((field) => normalize(student[field], field) === payload[field])
        );
        if (duplicate) {
            return res.status(409).json({ error: 'Este aluno já está cadastrado.' });
        }

        const { data, error } = await supabase
            .from('alunos')
            .update(payload)
            .eq('id', req.params.id)
            .eq('proprietario_id', req.user.id)
            .select();

        if (error) throw error;
        if (!data.length) return res.status(404).json({ error: 'Aluno não encontrado.' });

        return res.status(200).json({ message: 'Aluno atualizado com sucesso!', data });
    } catch (err) {
        return res.status(400).json({ error: 'Não foi possível atualizar o aluno.' });
    }
});

router.delete('/alunos/:id', authMiddleware, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('alunos')
            .delete()
            .eq('id', req.params.id)
            .eq('proprietario_id', req.user.id)
            .select('id');

        if (error) throw error;
        if (!data.length) {
            return res.status(404).json({ error: 'Aluno não encontrado.' });
        }

        return res.status(204).send();
    } catch (err) {
        return res.status(400).json({ error: 'Não foi possível remover o aluno.' });
    }
});

module.exports = router;