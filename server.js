const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'seu_secret_aqui_mude_em_producao';

app.use(cors());
app.use(express.json());

// Middleware de autenticação
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

// ===== ROTAS DE AUTENTICAÇÃO =====

// Registrar usuário
app.post('/api/auth/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  db.run(
    'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
    [username, email, hashedPassword],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Usuário ou email já existe' });
      }
      res.json({ message: '✅ Usuário registrado com sucesso', userId: this.lastID });
    }
  );
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.get('SELECT * FROM users WHERE email = ?', [email], (err, user) => {
    if (err || !user) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ error: 'Email ou senha inválidos' });
    }

    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email } });
  });
});

// ===== ROTAS DE BOTS =====

// Criar novo bot
app.post('/api/bots', authenticateToken, (req, res) => {
  const { bot_name, bot_token } = req.body;

  if (!bot_name || !bot_token) {
    return res.status(400).json({ error: 'Nome e token do bot são obrigatórios' });
  }

  db.run(
    'INSERT INTO bots (user_id, bot_name, bot_token, status) VALUES (?, ?, ?, ?)',
    [req.user.id, bot_name, bot_token, 'online'],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Erro ao criar bot' });
      }
      res.json({ message: '✅ Bot criado com sucesso', botId: this.lastID });
    }
  );
});

// Listar bots do usuário
app.get('/api/bots', authenticateToken, (req, res) => {
  db.all('SELECT * FROM bots WHERE user_id = ?', [req.user.id], (err, bots) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar bots' });
    }
    res.json(bots);
  });
});

// Deletar bot
app.delete('/api/bots/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM bots WHERE id = ? AND user_id = ?', [req.params.id, req.user.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar bot' });
    }
    res.json({ message: '✅ Bot deletado com sucesso' });
  });
});

// ===== ROTAS DE COMANDOS =====

// Criar comando
app.post('/api/commands', authenticateToken, (req, res) => {
  const { bot_id, command_name, command_response, cooldown } = req.body;

  if (!bot_id || !command_name || !command_response) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
  }

  db.run(
    'INSERT INTO commands (bot_id, command_name, command_response, cooldown) VALUES (?, ?, ?, ?)',
    [bot_id, command_name, command_response, cooldown || 3],
    function (err) {
      if (err) {
        return res.status(400).json({ error: 'Erro ao criar comando' });
      }
      res.json({ message: '✅ Comando criado com sucesso', commandId: this.lastID });
    }
  );
});

// Listar comandos de um bot
app.get('/api/commands/:bot_id', authenticateToken, (req, res) => {
  db.all('SELECT * FROM commands WHERE bot_id = ?', [req.params.bot_id], (err, commands) => {
    if (err) {
      return res.status(500).json({ error: 'Erro ao buscar comandos' });
    }
    res.json(commands);
  });
});

// Deletar comando
app.delete('/api/commands/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM commands WHERE id = ?', [req.params.id], function (err) {
    if (err) {
      return res.status(500).json({ error: 'Erro ao deletar comando' });
    }
    res.json({ message: '✅ Comando deletado com sucesso' });
  });
});

// ===== ROTA DE STATUS =====

app.get('/api/status', (req, res) => {
  res.json({ status: '✅ Servidor online', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});
