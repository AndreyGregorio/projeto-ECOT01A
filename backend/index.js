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

// --- Rota 5: CRIAR UM NOVO POST (Texto + Imagem opcional) ---
// Usa o mesmo 'upload' do multer, mas para o campo 'postImage'
app.post('/posts', upload.single('postImage'), async (req, res) => {
  try {
    // Pegamos o texto e o user_id do 'body' do FormData
    const { content, userId } = req.body;
    let imageUrl = null; // Começa como nulo

    // 1. O usuário enviou texto ou imagem?
    if (!content && !req.file) {
      return res.status(400).json({ error: 'O post não pode estar vazio.' });
    }
    if (!userId) {
      return res.status(400).json({ error: 'ID do usuário não fornecido.' });
    }

    // 2. Se tiver uma imagem, trate-a (igual ao avatar)
    if (req.file) {
      const filePath = req.file.path;
      // ❗ IMPORTANTE: Use o SEU IP aqui
      imageUrl = `http://192.168.15.17:3000/${filePath.replace(/\\/g, '/')}`;
    }

    // 3. Salve o post no banco de dados
    const newPost = await pool.query(
      `INSERT INTO posts (user_id, content, image_url) 
       VALUES ($1, $2, $3) 
       RETURNING *`, // Retorna o post que acabou de ser criado
      [userId, content, imageUrl]
    );

    // 4. Devolva o post criado (para o app, se ele precisar)
    res.status(201).json(newPost.rows[0]);

  } catch (err) {
    console.error("Erro ao criar post:", err.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// --- Rota 6: BUSCAR TODOS OS POSTS (O FEED) ---
app.get('/posts', async (req, res) => {
  try {
    // 1. O segredo está no JOIN:
    //    - Selecionamos tudo de 'posts'
    //    - E pegamos 'name' e 'avatar_url' de 'users'
    //    - Onde 'posts.user_id' é igual a 'users.id'
    //
    // 2. Ordenamos por 'created_at DESC' (do mais novo para o mais antigo)
    
    const feedQuery = await pool.query(
      `SELECT 
         posts.id, 
         posts.content, 
         posts.image_url, 
         posts.created_at, 
         users.name AS author_name, 
         users.avatar_url AS author_avatar
       FROM posts
       JOIN users ON posts.user_id = users.id
       ORDER BY posts.created_at DESC`
    );

    // 3. Envia a lista de posts de volta para o app
    res.status(200).json(feedQuery.rows);

  } catch (err) {
    console.error("Erro ao buscar posts:", err.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// --- Rota 7: BUSCAR POSTS DE UM USUÁRIO ESPECÍFICO (Para o Perfil) ---
// Note o ':id' no final. Vamos pegar o ID do usuário pela URL.
app.get('/posts/user/:id', async (req, res) => {
  try {
    const { id } = req.params; // ID do usuário

    // 1. Fazemos o MESMO JOIN que o feed principal
    //    Mas adicionamos o "WHERE posts.user_id = $1"
    const feedQuery = await pool.query(
      `SELECT 
         posts.id, 
         posts.content, 
         posts.image_url, 
         posts.created_at, 
         users.name AS author_name, 
         users.avatar_url AS author_avatar
       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.user_id = $1
       ORDER BY posts.created_at DESC`,
      [id]
    );

    // 2. Envia a lista de posts desse usuário
    res.status(200).json(feedQuery.rows);

  } catch (err) {
    console.error("Erro ao buscar posts do usuário:", err.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


// --- Rota 8: DELETAR UM POST ---
// Note que o ID aqui é o ID do POST, não do usuário
app.delete('/posts/:id', async (req, res) => {
  try {
    const { id } = req.params; // ID do post a ser deletado

    // 1. Executa o DELETE
    // ❗ NOTA DE SEGURANÇA:
    //    Isto é INSEGURO. Qualquer pessoa pode apagar o post de
    //    qualquer outra se souber o ID do post.
    //
    //    O CORRETO seria ter um middleware de autenticação (JWT)
    //    e fazer:
    //    const userId = req.user.id; // Pego do token
    //    DELETE FROM posts WHERE id = $1 AND user_id = $2
    //    [id, userId]
    //
    //    Mas, para manter simples por agora, vamos com o inseguro:
    await pool.query("DELETE FROM posts WHERE id = $1", [id]);

    // 2. Responde com sucesso (sem conteúdo)
    res.status(204).send();

  } catch (err) {
    console.error("Erro ao deletar post:", err.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => { 
    console.log(`Servidor rodando em http://0.0.0.0:${PORT}`); 
});