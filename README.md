# Task Manager API

Este projeto é uma API de gerenciamento de tarefas desenvolvida em Node.js com Express, Mongoose e autenticação via JWT.

Projeto baseado no vídeo [Node.js API com JWT e MongoDB - DevStack](https://www.youtube.com/watch?v=fZK57PxKC-0).

---

## Funcionalidades

- Cadastro e login de usuários
- Criação, atualização e exclusão de tarefas
- Relatórios (reportController.js)
- Uploads de arquivos (pasta /uploads)

---

## Tecnologias

- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT
- Bcrypt
- dotenv

---

## Estrutura do projeto

```bash
TASKMANAGER/
│
├── backend/
│   ├── config/
│   │   └── db.js                    # Configuração de conexão com o banco MongoDB
│   │
│   ├── controllers/                 # Lógica de negócio
│   │   ├── authController.js
│   │   ├── reportController.js
│   │   ├── taskController.js
│   │   └── userController.js
│   │
│   ├── middlewares/                # Middlewares customizados
│   │   ├── authMiddleware.js
│   │   └── uploadMiddleware.js
│   │
│   ├── models/                     # Schemas Mongoose
│   │   ├── Task.js
│   │   └── User.js
│   │
│   ├── routes/                     # Rotas express
│   │   ├── authRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── taskRoutes.js
│   │   └── userRoutes.js
│   │
│   ├── uploads/                    # Pasta onde ficam arquivos enviados
│   │
│   ├── .env                        # Variáveis de ambiente (NÃO subir para o Git)
│   ├── .gitignore                  # Ignora arquivos/pastas no Git
│   ├── package.json
│   ├── package-lock.json
│   └── server.js                   # Arquivo principal do servidor Express
│
├── frontend/Task-Manager/
│   ├── node_modules/
│   │
│   ├── public/                     # Arquivos estáticos públicos (ex.: index.html)
│   │
│   ├── src/                        # Código-fonte React
│   │
│   ├── .gitignore                  # Ignora arquivos/pastas no Git
│   ├── eslint.config.js            # Configuração do eslint
│   ├── index.html                  # HTML principal
│   ├── package.json
│   ├── package-lock.json
│   ├── vite.config.js              # Configuração do Vite.js
│   └── README.md                   # Documentação do frontend
│
├── README.md                       # Documentação do projeto como um todo
└── .gitignore                      # Ignora arquivos/pastas no Git na raiz
```

---

## Instalação

1. Clone o repositório:

```bash
git clone https://github.com/seu-usuario/seu-repo.git
```

2. Instale as dependências:

```bash
npm install
```

3. Crie o arquivo .env na raiz do backend:

```bash
PORT=5000
MONGO_URI=seu_mongodb_uri
JWT_SECRET=sua_chave_secreta
```

4. Execute o servidor:

```bash
npm run dev
```
