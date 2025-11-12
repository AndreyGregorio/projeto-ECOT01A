// --- index.js (no backend) ---
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');

// 👇 MUDANÇA 1: Importar o 'multer' e o 'path' (para lidar com caminhos)
const multer = require('multer');
const path = require('path');

const app = express();

app.use(cors()); 
app.use(express.json());

// 👇 MUDANÇA 2: Criar uma pasta 'uploads'
// Diga ao Express para servir arquivos estáticos dessa pasta
// Isso permite que o app acesse 'http://SEU_IP:3000/uploads/imagem.jpg'
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 👇 MUDANÇA 3: Configurar o 'multer'
// Onde vamos salvar os arquivos?
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Salve na pasta 'uploads/'
  },
  filename: (req, file, cb) => {
    // Crie um nome de arquivo único para evitar conflitos
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// --- (Suas rotas de register, login, e /profile/:id continuam aqui) ---
// ...
// app.post('/register', ...)
// app.post('/login', ...)
// app.put('/profile/:id', ...)
// ...

// 👇 MUDANÇA 4: ROTA NOVA SÓ PARA O UPLOAD DA FOTO
// O 'upload.single('avatar')' é o middleware do multer.
// Ele procura por um campo chamado 'avatar' no FormData.
app.post('/profile/upload-avatar', upload.single('avatar'), async (req, res) => {
  try {
    // IMPORTANTE: Precisamos saber PARA QUAL usuário é essa foto.
    // O app precisa enviar o ID do usuário (ou o token).
    // Vamos assumir que o app vai enviar o ID no body.
    // **NOTA:** Uma solução melhor é usar um middleware de auth (JWT)
    // mas vamos simplificar por agora.
    const { userId } = req.body; 
    
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // O 'multer' nos dá 'req.file'
    const filePath = req.file.path;

    // Precisamos de uma URL acessível, não um caminho de sistema
    // Substitua barras invertidas (Windows) por barras normais
    const fileUrl = `http://192.168.15.17:3000/${filePath.replace(/\\/g, '/')}`;

    // 2. Salve essa URL no banco
    const updateQuery = await pool.query(
      `UPDATE users 
       SET avatar_url = $1 
       WHERE id = $2
       RETURNING id, name, email, course, bio, avatar_url`,
      [fileUrl, userId]
    );

    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }

    // 3. Retorne o usuário atualizado
    res.status(200).json(updateQuery.rows[0]);

  } catch (err) {
    console.error("Erro no upload do avatar:", err.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => { 
    console.log(`Servidor rodando em http://0.0.0.0:${PORT}`); 
});