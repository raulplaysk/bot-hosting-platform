# 🤖 Bot Hosting Platform

Uma plataforma web completa para hospedagem gratuita de bots Discord 24/7, sem custos e sem limites de tempo.

## ✨ Características

- ✅ **Hospedagem 24/7 Gratuita** - Mantenha seus bots online indefinidamente
- ✅ **Painel Web Intuitivo** - Interface fácil de usar
- ✅ **Gerenciamento de Bots** - Adicione e remova bots facilmente
- ✅ **Criação de Comandos** - Crie comandos customizados sem código
- ✅ **Sistema de Autenticação** - Contas seguras com JWT
- ✅ **Banco de Dados** - Armazenamento seguro de dados

## 🚀 Início Rápido

### Instalação

```bash
git clone seu_repositorio
cd bot-hosting-platform
npm install
```

### Configuração

1. Copie `.env.example` para `.env`
2. Configure as variáveis de ambiente:
   ```
   PORT=5000
   JWT_SECRET=seu_secret_super_seguro_aqui
   NODE_ENV=development
   ```

### Executar

```bash
npm start
```

O servidor rodará em `http://localhost:5000`

## 📋 Como Usar

### 1. Criar Conta

1. Acesse o site
2. Clique em "Registrar"
3. Preencha os dados (username, email, senha)
4. Clique em "Criar Conta"

### 2. Adicionar Bot

1. Faça login
2. Vá para "Meus Bots"
3. Preencha:
   - **Nome do bot**: Nome para identificar
   - **Token do bot**: Token do seu bot Discord
4. Clique em "Adicionar Bot"

### 3. Criar Comandos

1. Vá para "Comandos"
2. Selecione um bot
3. Preencha:
   - **Nome do comando**: Ex: `ping`
   - **Resposta**: O que o bot responderá
   - **Cooldown**: Tempo de espera entre usos (em segundos)
4. Clique em "Criar Comando"

## 📁 Estrutura do Projeto

```
bot-hosting-platform/
├── server.js           # Servidor Express principal
├── db.js               # Configuração do banco de dados
├── public/
│   ├── index.html      # Interface web
│   ├── style.css       # Estilos
│   └── script.js       # Lógica do frontend
├── package.json        # Dependências
├── .env.example        # Exemplo de variáveis
└── README.md           # Este arquivo
```

## 🔌 API Endpoints

### Autenticação
- `POST /api/auth/register` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Bots
- `GET /api/bots` - Listar bots do usuário
- `POST /api/bots` - Criar novo bot
- `DELETE /api/bots/:id` - Deletar bot

### Comandos
- `GET /api/commands/:bot_id` - Listar comandos de um bot
- `POST /api/commands` - Criar novo comando
- `DELETE /api/commands/:id` - Deletar comando

## 🛠️ Tecnologias

- **Backend**: Node.js, Express
- **Frontend**: HTML, CSS, JavaScript
- **Banco de Dados**: SQLite3
- **Autenticação**: JWT, bcryptjs
- **Discord**: discord.js

## 📝 Variáveis de Ambiente

```env
PORT=5000                              # Porta do servidor
JWT_SECRET=seu_secret_super_seguro    # Secret para JWT
NODE_ENV=development                   # Ambiente
```

## 🔐 Segurança

- Senhas são criptografadas com bcryptjs
- Autenticação via JWT
- CORS habilitado para requisições seguras
- Validação de entrada em todas as rotas

## 🚀 Deploy

### Railway (Recomendado)
1. Acesse [railway.app](https://railway.app)
2. Conecte seu repositório GitHub
3. Configure variáveis de ambiente
4. Deploy automático

### Heroku
1. Instale [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
2. Execute: `heroku create seu-app-name`
3. Configure variáveis: `heroku config:set JWT_SECRET=seu_secret`
4. Deploy: `git push heroku main`

### Replit
1. Acesse [replit.com](https://replit.com)
2. Importe do GitHub
3. Configure `.env`
4. Clique em "Run"

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no repositório.

## 📄 Licença

MIT

---

**Desenvolvido para manter seus bots Discord online 24/7 sem custos! 🚀**
