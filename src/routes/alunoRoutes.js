const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

// Listar todos os alunos
router.get('/alunos', async (req, res) => {
    try {
        const { data, error } = await supabase.from('alunos').select('*');
        
        if (error) throw error;
        
        return res.status(200).json(data);
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

// Cadastrar um novo aluno
router.post('/alunos', async (req, res) => {
    try {
        const { nome, escola, valor, vencimento, turma, professora, responsavel, telefone } = req.body;

        const { data, error } = await supabase
            .from('alunos')
            .insert([{ nome, escola, valor, vencimento, turma, professora, responsavel, telefone }])
            .select();

        if (error) throw error;

        return res.status(201).json({ message: "Aluno cadastrado com sucesso!", data });
    } catch (err) {
        return res.status(400).json({ error: err.message });
    }
});

module.exports = router;