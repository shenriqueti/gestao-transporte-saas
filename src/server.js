const express = require('express');
const cors = require('cors');
require('dotenv').config();

const alunoRoutes = require('./routes/alunoRoutes');

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());

app.use('/api', alunoRoutes);

// test route 
app.get('/', (req, res) => {
    return res.json({ status: "API de Gestão de Transporte Online 🚀" });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});

