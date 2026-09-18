const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const alunoRoutes = require('./routes/alunoRoutes');
const mensalidadeRoutes = require('./routes/mensalidadeRoutes');
const rotaRoutes = require('./routes/rotaRoutes');

const app = express();
const PORT = process.env.PORT || 3333;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/api', alunoRoutes);
app.use('/api', mensalidadeRoutes);
app.use('/api', rotaRoutes);

app.get('/', (req, res) => {
    return res.sendFile(path.join(__dirname, 'public', 'login.html'));
});

app.get('/config.js', (req, res) => {
    res.type('application/javascript');
    return res.send(
        `window.APP_CONFIG = ${JSON.stringify({
            supabaseUrl: process.env.SUPABASE_URL,
            supabaseAnonKey: process.env.SUPABASE_KEY
        })};`
    );
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});
