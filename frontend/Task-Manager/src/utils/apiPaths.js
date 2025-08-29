export const BASE_URL = "http://localhost:8000";

// utils/apiPaths.js
export const API_PATHS = {
    AUTH: {
        REGISTER: "/api/auth/register", // Cadastra/registra um novo usuário (Admin ou Membro)
        LOGIN: "/api/auth/login", // Autenticação de usuário e retorna JWT token
        GET_PROFILE: "/api/auth/profile", // Busca detalhes do usuário logado
    },

    USERS: {
        GET_ALL_USERS: "/api/users", // Busca todos os usuários (apenas Admin)
        GET_USER_BY_ID: (userId) => `/api/users/${userId}`, // Busca usuário pelo seu Id
        CREATE_USER: "/api/users", // Cria um novo usuário (apenas Admin)
        UPDATE_USER: (userId) => `/api/users/${userId}`, // Atualiza detalhes do usuário
        DELETE_USER: (userId) => `/api/users/${userId}`, //Apaga usuário
    },

    TASKS: {
        GET_DASHBOARD_DATA: "/api/tasks/dashboard-data", // Busca os dados para o dashboard
        GET_USER_DASHBOARD_DATA: "/api/tasks/user-dashboard-data", // Busca os dados do usuário para o dashboard
        GET_ALL_TASKS: "/api/tasks", // Busca todos as tarefas (Admin: todas; Users: só as suas)
        GET_TASK_BY_ID: (taskId) => `/api/tasks/${taskId}`, // Busca tarefa pelo seu Id
        CREATE_TASK: "/api/tasks", // Cria uma nova tarefa (apenas Admin)
        UPDATE_TASK: (taskId) => `/api/tasks/${taskId}`, // Atualiza detalhes da tarefa
        DELETE_TASK: (taskId) => `/api/tasks/${taskId}`, // Apaga tarefa (apenas Admin)
    
        UPDATE_TASK_STATUS: (taskId) => `/api/tasks/${taskId}/status`, // Atualiza status da tarefa
        UPDATE_TODO_CHECKLIST: (taskId) => `/api/tasks/${taskId}/todo`, // Atualiza checklist da tarefa
    },

    REPORTS: {
        EXPORT_TASKS: "/api/reports/export/tasks", // Exporta todas as tarefas como Excel/PDF
        EXPORT_USERS: "/api/reports/export/users", // Exporta os relatórios de tarefa dos usuários como Excel/PDF
    },

    IMAGE: {
        UPLOAD_IMAGE: "/api/auth/upload-image",
    },
};