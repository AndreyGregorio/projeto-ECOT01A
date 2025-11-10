// --- index.js (no backend) ---
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 2. IMPORTE SEU ARQUIVO db.js
const pool = require('./db');

const app = express();

// --- Middlewares (Configurações) ---
app.use(cors()); 
app.use(express.json());


// --- Rota de Teste (só para ver se está funcionando) ---
app.get('/', (req, res) => {
    res.send('API está funcionando!');
});

// --- Rota 1: Cadastro (MODIFICADA) ---
app.post('/register', async (req, res) => {
    // 1. MUDANÇA: Pegar 'email' do body
    const { name, email, password } = req.body;

    // 2. MUDANÇA: Validar 'email'
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }

    try {
        // 3. Criptografar a senha (sem mudança)
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. MUDANÇA: Salvar no banco de dados (com email)
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashedPassword]
        );

        console.log(newUser.rows[0]);

        res.status(201).json(newUser.rows[0]); // Retorna o usuário criado

    } catch (err) {
        console.error(err.message);
        // 5. MUDANÇA: Tratar erro de email duplicado
        // Código '23505' é erro de "unique constraint"
        if (err.code === '23505') {
            // Este 'error' bate com o que o AuthContext espera
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

app.post('/login', async (req, res) => {
    // 1. MUDANÇA: Esperar 'email' e 'password' do body
    const { email, password } = req.body;

    try {
        // 2. MUDANÇA: Buscar o usuário pelo 'email'
        const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        
        // 3. Checar se o usuário existe
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        const user = userQuery.rows[0];
        // O comentário fofo ainda está aqui <3
        
        // 4. Comparar a senha (sem mudança)
        const isMatch = await bcrypt.compare(password, user.password_hash); // Use user.password_hash (provavelmente é o nome da sua coluna)

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        // 5. Criar o token (sem mudança)
        const token = jwt.sign(
            { id: user.id, name: user.name, email: user.email }, 
            "seuSegredoJWT", 
            { expiresIn: '1h' }
        );

        res.json({ token });

    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

const PORT = 3000;

// --- Iniciar o Servidor ---
app.listen(PORT, '0.0.0.0', () => { 
    console.log(`Servidor rodando em http://0.0.0.0:${PORT}`); 
});