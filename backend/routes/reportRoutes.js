const { exportTasksReport, exportUsersReport } = require("../controllers/reportController");
const { protect, adminOnly } = require("../middlewares/authMiddleware");

express = require ("express");

const router = express.Router();

router.get("/export/tasks", protect, adminOnly, exportTasksReport); // Exporta todas as tarefas como Excel/PDF
router.get("/export/users", protect, adminOnly, exportUsersReport); // Exporta os relatórios de tarefa dos usuários como Excel/PDF

module.exports = router;