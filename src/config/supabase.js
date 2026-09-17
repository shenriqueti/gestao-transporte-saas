const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Erro: As variáveis de ambiente do Supabase não foram configuradas corretamente no arquivo .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = supabase;