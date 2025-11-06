const API_URL = 'http://localhost:5000/api';
let token = localStorage.getItem('token');
let currentUser = JSON.parse(localStorage.getItem('user') || '{}');
let selectedBotId = null;

// ===== INICIALIZAÇÃO =====
document.addEventListener('DOMContentLoaded', () => {
  if (token) {
    showDashboard();
  } else {
    showAuthScreen();
  }
});

// ===== AUTENTICAÇÃO =====
function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.tab-btn').forEach(el => el.classList.remove('active'));
  
  document.getElementById(tab + 'Tab').classList.add('active');
  event.target.classList.add('active');
}

async function register() {
  const username = document.getElementById('registerUsername').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  if (!username || !email || !password) {
    alert('Preencha todos os campos');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();
    if (res.ok) {
      alert('✅ Conta criada! Faça login agora.');
      switchTab('login');
    } else {
      alert('❌ Erro: ' + data.error);
    }
  } catch (err) {
    alert('Erro ao registrar: ' + err.message);
  }
}

async function login() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  if (!email || !password) {
    alert('Preencha todos os campos');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();
    if (res.ok) {
      token = data.token;
      currentUser = data.user;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(currentUser));
      showDashboard();
    } else {
      alert('❌ Erro: ' + data.error);
    }
  } catch (err) {
    alert('Erro ao fazer login: ' + err.message);
  }
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  token = null;
  currentUser = {};
  showAuthScreen();
}

// ===== NAVEGAÇÃO =====
function showAuthScreen() {
  document.getElementById('authScreen').classList.remove('hidden');
  document.getElementById('dashboardScreen').classList.add('hidden');
}

function showDashboard() {
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('dashboardScreen').classList.remove('hidden');
  document.getElementById('userDisplay').textContent = `👤 ${currentUser.username}`;
  loadBots();
}

function switchDashboard(section) {
  document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.sidebar-btn').forEach(el => el.classList.remove('active'));
  
  document.getElementById(section + 'Section').classList.add('active');
  event.target.classList.add('active');

  if (section === 'commands') {
    loadBotsForSelect();
  }
}

// ===== BOTS =====
async function loadBots() {
  try {
    const res = await fetch(`${API_URL}/bots`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const bots = await res.json();
    const botsList = document.getElementById('botsList');

    if (bots.length === 0) {
      botsList.innerHTML = '<p>Nenhum bot criado ainda. Crie um novo!</p>';
      return;
    }

    botsList.innerHTML = bots.map(bot => `
      <div class="bot-card">
        <div class="bot-info">
          <h3>🤖 ${bot.bot_name}</h3>
          <p>ID: ${bot.id}</p>
          <span class="bot-status status-online">✅ Online</span>
        </div>
        <div class="bot-actions">
          <button class="btn-delete" onclick="deleteBot(${bot.id})">Deletar</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Erro ao carregar bots:', err);
  }
}

async function loadBotsForSelect() {
  try {
    const res = await fetch(`${API_URL}/bots`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const bots = await res.json();
    const select = document.getElementById('botSelect');
    
    select.innerHTML = '<option value="">-- Escolha um bot --</option>';
    bots.forEach(bot => {
      select.innerHTML += `<option value="${bot.id}">${bot.bot_name}</option>`;
    });
  } catch (err) {
    console.error('Erro ao carregar bots:', err);
  }
}

async function addBot() {
  const botName = document.getElementById('botName').value;
  const botToken = document.getElementById('botToken').value;

  if (!botName || !botToken) {
    alert('Preencha todos os campos');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/bots`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ bot_name: botName, bot_token: botToken })
    });

    const data = await res.json();
    if (res.ok) {
      alert('✅ Bot adicionado com sucesso!');
      document.getElementById('botName').value = '';
      document.getElementById('botToken').value = '';
      loadBots();
    } else {
      alert('❌ Erro: ' + data.error);
    }
  } catch (err) {
    alert('Erro ao adicionar bot: ' + err.message);
  }
}

async function deleteBot(botId) {
  if (!confirm('Tem certeza que deseja deletar este bot?')) return;

  try {
    const res = await fetch(`${API_URL}/bots/${botId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      alert('✅ Bot deletado com sucesso!');
      loadBots();
    } else {
      alert('❌ Erro ao deletar bot');
    }
  } catch (err) {
    alert('Erro: ' + err.message);
  }
}

// ===== COMANDOS =====
function loadCommands() {
  const botId = document.getElementById('botSelect').value;
  
  if (!botId) {
    document.getElementById('commandsContent').style.display = 'none';
    return;
  }

  selectedBotId = botId;
  document.getElementById('commandsContent').style.display = 'block';
  loadCommandsList();
}

async function loadCommandsList() {
  try {
    const res = await fetch(`${API_URL}/commands/${selectedBotId}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    const commands = await res.json();
    const commandsList = document.getElementById('commandsList');

    if (commands.length === 0) {
      commandsList.innerHTML = '<p>Nenhum comando criado ainda.</p>';
      return;
    }

    commandsList.innerHTML = commands.map(cmd => `
      <div class="command-card">
        <div class="command-info">
          <h3>!${cmd.command_name}</h3>
          <p>${cmd.command_response}</p>
          <small>Cooldown: ${cmd.cooldown}s</small>
        </div>
        <div class="command-actions">
          <button class="btn-delete" onclick="deleteCommand(${cmd.id})">Deletar</button>
        </div>
      </div>
    `).join('');
  } catch (err) {
    console.error('Erro ao carregar comandos:', err);
  }
}

async function addCommand() {
  const commandName = document.getElementById('commandName').value;
  const commandResponse = document.getElementById('commandResponse').value;
  const cooldown = document.getElementById('commandCooldown').value;

  if (!commandName || !commandResponse) {
    alert('Preencha todos os campos');
    return;
  }

  try {
    const res = await fetch(`${API_URL}/commands`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        bot_id: selectedBotId,
        command_name: commandName,
        command_response: commandResponse,
        cooldown: parseInt(cooldown)
      })
    });

    const data = await res.json();
    if (res.ok) {
      alert('✅ Comando criado com sucesso!');
      document.getElementById('commandName').value = '';
      document.getElementById('commandResponse').value = '';
      document.getElementById('commandCooldown').value = '3';
      loadCommandsList();
    } else {
      alert('❌ Erro: ' + data.error);
    }
  } catch (err) {
    alert('Erro ao criar comando: ' + err.message);
  }
}

async function deleteCommand(commandId) {
  if (!confirm('Tem certeza que deseja deletar este comando?')) return;

  try {
    const res = await fetch(`${API_URL}/commands/${commandId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (res.ok) {
      alert('✅ Comando deletado com sucesso!');
      loadCommandsList();
    } else {
      alert('❌ Erro ao deletar comando');
    }
  } catch (err) {
    alert('Erro: ' + err.message);
  }
}
