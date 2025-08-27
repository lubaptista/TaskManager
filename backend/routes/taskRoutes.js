express = require ("express");
const { getDashboardData, getUserDashboardData, getTasks, getTaskById, createTask, updateTask, deleteTask, updateTaskStatus, updateTaskChecklist } = require("../controllers/taskController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

const router = express.Router();

//Task Management Routes
router.get("/dashboard-data", protect, getDashboardData); 
router.get("/user-dashboard-data", protect, getUserDashboardData); 
router.get("/", protect, getTasks); //Busca todas as tarefas (Admin: todas; User: atribuídas)
router.get("/:id", protect, getTaskById); //Busca uma tarefa em específico pelo ID
router.post("/", protect, adminOnly, createTask); //Criar uma tarefa (apenas Admin)
router.put("/:id", protect, updateTask); //Editar detalhes de uma tarefa em específico pelo ID
router.delete("/:id", protect, adminOnly, deleteTask); //Apagar uma tarefa em específico pelo ID (apenas Admin)
router.put("/:id/status", protect, updateTaskStatus); //Editar status de uma tarefa em específico pelo ID
router.put("/:id/todo", protect, updateTaskChecklist); //Editar checklist de uma tarefa em específico pelo ID

module.exports = router;