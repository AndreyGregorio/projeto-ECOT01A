// --- index.js (no backend) ---

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg'); // Importa o 'Pool' do 'pg'

const app = express();

// --- Middlewares (Configurações) ---
app.use(cors()); // Permite requisições de outros domínios (do seu frontend)
app.use(express.json()); // Permite que o Express entenda JSON

// --- Configuração da Conexão com o PostgreSQL ---
const pool = new Pool({
    user: 'postgres', // Seu usuário do PostgreSQL (geralmente 'postgres')
    host: 'localhost',
    database: 'projeto', // O nome do banco que você criou
    password: 'cssn', // A SENHA que você criou na instalação do PG
    port: 5432, // Porta padrão do PostgreSQL
});

// --- Rota de Teste (só para ver se está funcionando) ---
app.get('/', (req, res) => {
    res.send('API está funcionando!');
});

// --- Rota 1: Cadastro (MVP Item 1) ---
app.post('/register', async (req, res) => {
    const { name, password } = req.body;

    // 1. Validar se os dados vieram
    if (!name || !password) {
        return res.status(400).json({ error: 'Nome e senha são obrigatórios.' });
    }

    try {
        // 2. Criptografar a senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Salvar no banco de dados
        const newUser = await pool.query(
            "INSERT INTO users (name, password) VALUES ($1, $2) RETURNING id, name",
            [name, hashedPassword]
        );

        res.status(201).json(newUser.rows[0]); // Retorna o usuário criado (sem a senha)

    } catch (err) {
        console.error(err.message);
        // Código '23505' é erro de "unique constraint" (nome já existe)
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Este nome de usuário já existe.' });
        }
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// --- Rota 2: Login (MVP Item 2) ---
app.post('/login', async (req, res) => {
    const { name, password } = req.body;

    try {
        // 1. Buscar o usuário pelo nome
        const userQuery = await pool.query("SELECT * FROM users WHERE name = $1", [name]);
        
        // 2. Checar se o usuário existe
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas.' }); // 401 = Não autorizado
        }

        const user = userQuery.rows[0];

        // 3. Comparar a senha enviada com a senha criptografada no banco
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // 4. Se deu tudo certo, criar um token JWT
        // O "seuSegredoJWT" deve ser algo complexo e guardado em variáveis de ambiente (mas para o MVP, serve)
        const token = jwt.sign(
            { id: user.id, name: user.name }, 
            "seuSegredoJWT", 
            { expiresIn: '1h' } // Token expira em 1 hora
        );

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});


// --- Iniciar o Servidor ---
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});