// --- index.js (no backend) ---
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('./db');
const multer = require('multer');
const path = require('path');

const app = express();

// --- Middlewares (Configurações) ---
app.use(cors()); 
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Configuração do Multer (Sem mudança) ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage: storage });


// --- Middleware de Autenticação (Sem mudança) ---
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) { return next(); }
  jwt.verify(token, "seuSegredoJWT", (err, user) => {
    if (err) { return next(); }
    req.user = user; 
    next();
  });
};

// --- Rota de Teste (Sem mudança) ---
app.get('/', (req, res) => {
    res.send('API está funcionando!');
});

// --- Rota 1: Cadastro (Sem mudança) ---
app.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Nome, email e senha são obrigatórios.' });
    }
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const newUser = await pool.query(
            "INSERT INTO users (name, email, password_hash) VALUES ($1, $2, $3) RETURNING id, name, email",
            [name, email, hashedPassword]
        );
        res.status(201).json(newUser.rows[0]);
    } catch (err) {
        console.error(err.message);
        if (err.code === '23505') {
            return res.status(400).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// --- Rota 2: Login (Sem mudança) ---
app.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userQuery = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }
        const user = userQuery.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);
        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }
        const userPayload = {
          id: user.id, name: user.name, email: user.email,
          course: user.course, bio: user.bio, avatar_url: user.avatar_url
        };
        const token = jwt.sign(userPayload, "seuSegredoJWT", { expiresIn: '1h' });
        res.json({ token, user: userPayload });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// --- Rota 3: Atualizar Perfil (TEXTO) (Sem mudança) ---
app.put('/profile/:id', verifyToken, async (req, res) => {
    try {
        const { id: profileId } = req.params;
        const { name, course, bio } = req.body; 
        if (!req.user || req.user.id !== parseInt(profileId, 10)) {
            return res.status(403).json({ error: 'Acesso negado.' });
        }
        if (!name) {
            return res.status(400).json({ error: 'O nome é obrigatório.' });
        }
        const updateQuery = await pool.query(
            `UPDATE users SET name = $1, course = $2, bio = $3 WHERE id = $4
             RETURNING id, name, email, course, bio, avatar_url`, 
            [name, course, bio, profileId]
        );
        if (updateQuery.rows.length === 0) {
            return res.status(404).json({ error: 'Usuário não encontrado.' });
        }
        res.status(200).json(updateQuery.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ error: 'Erro interno do servidor.' });
    }
});

// --- Rota 4: UPLOAD DE FOTO DO PERFIL (Sem mudança) ---
app.post('/profile/upload-avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária.' });
    }
    const { id: userId } = req.user;
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }
    const filePath = req.file.path;
    const fileUrl = `http://192.168.15.17:3000/${filePath.replace(/\\/g, '/')}`;
    const updateQuery = await pool.query(
      `UPDATE users SET avatar_url = $1 WHERE id = $2
       RETURNING id, name, email, course, bio, avatar_url`,
      [fileUrl, userId]
    );
    if (updateQuery.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado.' });
    }
    res.status(200).json(updateQuery.rows[0]);
  } catch (err) {
    console.error("Erro no upload do avatar:", err.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});

// --- Rota 5: CRIAR UM NOVO POST (Sem mudança) ---
app.post('/posts', verifyToken, upload.single('postImage'), async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária.' });
    }
    const { id: userId } = req.user;
    const { content } = req.body;
    let imageUrl = null; 
    if (!content && !req.file) {
      return res.status(400).json({ error: 'O post não pode estar vazio.' });
    }
    if (req.file) {
      const filePath = req.file.path;
      imageUrl = `http://192.168.15.17:3000/${filePath.replace(/\\/g, '/')}`;
    }
    const newPost = await pool.query(
      `INSERT INTO posts (user_id, content, image_url) VALUES ($1, $2, $3) RETURNING *`,
      [userId, content, imageUrl]
    );
    res.status(201).json(newPost.rows[0]);
  } catch (err) {
    console.error("Erro ao criar post:", err.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


// --- Rota 6: BUSCAR TODOS OS POSTS (O FEED) ---
// <-- MUDANÇA: Adicionada contagem de comentários -->
app.get('/posts', verifyToken, async (req, res) => {
  try {
    const myUserId = req.user ? req.user.id : 0;
    const feedQuery = await pool.query(
      `SELECT 
         posts.id, 
         posts.content, 
         posts.image_url, 
         posts.created_at, 
         users.name AS author_name, 
         users.avatar_url AS author_avatar,
         
         (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id) AS total_likes,
         EXISTS (
           SELECT 1 FROM post_likes 
           WHERE post_id = posts.id AND user_id = $1
         ) AS liked_by_me,
         
         -- <-- MUDANÇA AQUI -->
         (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS total_comments
         
       FROM posts
       JOIN users ON posts.user_id = users.id
       ORDER BY posts.created_at DESC`,
      [myUserId]
    );
    res.status(200).json(feedQuery.rows);
  } catch (err) {
    console.error("Erro ao buscar posts:", err.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


// --- Rota 7: BUSCAR POSTS DE UM USUÁRIO ESPECÍFICO ---
// <-- MUDANÇA: Adicionada contagem de comentários -->
app.get('/posts/user/:id', verifyToken, async (req, res) => {
  try {
    const { id: profileUserId } = req.params;
    const myUserId = req.user ? req.user.id : 0;
    const feedQuery = await pool.query(
      `SELECT 
         posts.id, 
         posts.content, 
         posts.image_url, 
         posts.created_at, 
         users.name AS author_name, 
         users.avatar_url AS author_avatar,
         (SELECT COUNT(*) FROM post_likes WHERE post_id = posts.id) AS total_likes,
         EXISTS (
           SELECT 1 FROM post_likes 
           WHERE post_id = posts.id AND user_id = $1
         ) AS liked_by_me,
         
         -- <-- MUDANÇA AQUI -->
         (SELECT COUNT(*) FROM comments WHERE post_id = posts.id) AS total_comments

       FROM posts
       JOIN users ON posts.user_id = users.id
       WHERE posts.user_id = $2
       ORDER BY posts.created_at DESC`,
      [myUserId, profileUserId]
    );
    res.status(200).json(feedQuery.rows);
  } catch (err) {
    console.error("Erro ao buscar posts do usuário:", err.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


// --- Rota 8: DELETAR UM POST (Sem mudança) ---
app.delete('/posts/:id', verifyToken, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Autenticação necessária.' });
    }
    const { id: postId } = req.params;
    const { id: userId } = req.user;
    const deleteQuery = await pool.query(
      "DELETE FROM posts WHERE id = $1 AND user_id = $2", 
      [postId, userId]
    );
    if (deleteQuery.rowCount === 0) {
      return res.status(403).json({ error: 'Acesso negado.' });
    }
    res.status(204).send();
  } catch (err) {
    console.error("Erro ao deletar post:", err.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


// --- Rota 9: CURTIR/DESCURTIR (Sem mudança) ---
app.post('/posts/:id/toggle-like', verifyToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária.' });
  }
  const { id: postId } = req.params;
  const { id: userId } = req.user;
  try {
    const likeQuery = await pool.query(
      "SELECT * FROM post_likes WHERE user_id = $1 AND post_id = $2",
      [userId, postId]
    );
    if (likeQuery.rows.length > 0) {
      await pool.query(
        "DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2",
        [userId, postId]
      );
      res.status(200).json({ liked: false });
    } else {
      await pool.query(
        "INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)",
        [userId, postId]
      );
      res.status(200).json({ liked: true });
    }
  } catch (err) {
    if (err.code === '23505') {
        return res.status(409).json({ error: 'Conflito, tente novamente.' });
    }
    console.error("Erro no toggle-like:", err.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


// <-- MUDANÇA: ADICIONADAS ROTAS 10 E 11 PARA COMENTÁRIOS -->

// --- Rota 10: LER todos os comentários de um post ---
app.get('/posts/:id/comments', verifyToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária.' });
  }
  
  try {
    const { id: postId } = req.params;

    // Fazemos um JOIN para pegar o nome e o avatar de quem comentou
    const commentsQuery = await pool.query(
      `SELECT
         comments.id,
         comments.content,
         comments.created_at,
         users.name AS author_name,
         users.avatar_url AS author_avatar
       FROM comments
       JOIN users ON comments.user_id = users.id
       WHERE comments.post_id = $1
       ORDER BY comments.created_at ASC`, // Mais antigo primeiro
      [postId]
    );

    res.status(200).json(commentsQuery.rows);

  } catch (err) {
    console.error("Erro ao buscar comentários:", err.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


// --- Rota 11: CRIAR um novo comentário em um post ---
app.post('/posts/:id/comments', verifyToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Autenticação necessária.' });
  }

  try {
    const { id: postId } = req.params;      // ID do Post (da URL)
    const { content } = req.body;           // Texto do comentário
    
    // Pegamos todos os dados do user do token (jeito certo)
    const { id: userId, name: authorName, avatar_url: authorAvatar } = req.user;

    if (!content) {
      return res.status(400).json({ error: 'O comentário não pode estar vazio.' });
    }

    // Insere o novo comentário
    const newComment = await pool.query(
      `INSERT INTO comments (user_id, post_id, content)
       VALUES ($1, $2, $3)
       RETURNING id, content, created_at`, // Pega só o que precisamos
      [userId, postId, content]
    );

    // Constrói o objeto de resposta para a UI
    // (O frontend precisa saber o nome/avatar sem ter que pedir de novo)
    const commentWithAuthor = {
      id: newComment.rows[0].id,
      content: newComment.rows[0].content,
      created_at: newComment.rows[0].created_at,
      author_name: authorName,      // Veio do token
      author_avatar: authorAvatar   // Veio do token
    };

    res.status(201).json(commentWithAuthor);

  } catch (err) {
    console.error("Erro ao criar comentário:", err.message);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
});


const PORT = 3000;

// --- Iniciar o Servidor ---
app.listen(PORT, '0.0.0.0', () => { 
    console.log(`Servidor rodando em http://0.0.0.0:${PORT}`); 
});