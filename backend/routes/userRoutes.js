const express = require ("express");
const { protect, adminOnly } = require("../middlewares/authMiddleware");
const { getUsers, getUserById, deleteUser } = require("../controllers/userController");

const router = express.Router();

//User Management Routes
router.get("/", protect, adminOnly, getUsers); //Busca todos os usuários (apenas Admin)
router.get("/:id", protect, getUserById); //Busca um usuário em específico 

module.exports = router;