const Task = require("../models/Task");

// @desc    Get all tasks (Admin: todas, User: só atribuídas)
// @route   GET /api/tasks
// @access  Private 
const getTasks = async (req, res) => {
    try {
        const { status } = req.query;
        let filter = {};

        if (status) {
            filter.status = status;
        }

        let tasks;

        if (req.user.role === "admin") {
            tasks = await Task.find(filter).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        } else {
            tasks = await Task.find({ ...filter, assignedTo: req.user._id}).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }

        // Adiciona contador de todoChecklist completos para cada tarefa 
        tasks = await Promise.all(
            tasks.map(async (task) => {
                const completedCount = task.todoChecklist.filter(
                    (item) => item.completed
                ).length;
                return { ...task._doc, completedTodoCount: completedCount};
            })
        );

        // Sumário de contador de Status
        const allTasks = await Task.countDocuments(
           req.user.role === "admin" ? {} : { assignedTo: req.user._id } 
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ... (req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ... (req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ... (req.user.role !== "admin" && { assignedTo: req.user._id }),
        });

        res.json({
           tasks,
           statusSumary: {
            all: allTasks,
            pendingTasks,
            inProgressTasks,
            completedTasks
           },
        });

    } catch (error) {
        res.status(500).json({ message: "Erro de Servidor", error: error.message });
    }
};

// @desc    Get task by ID 
// @route   GET /api/tasks/:id
// @access  Private 
const getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        if (!task)
            res.status(404).json({ message: "Tarefa não encontrada" });
        res.json(task);
        
    } catch (error) {
        res.status(500).json({ message: "Erro de Servidor", error: error.message });
    }
};

// @desc    Create a new task (apenas Admin)
// @route   POST /api/tasks/:id
// @access  Private 
const createTask = async (req, res) => {
    try {
        const {
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        } = req.body;

        if (!Array.isArray(assignedTo)){
            return res
                .status(400)
                .json({message: "assignedTo deve ser um array de IDs de usuários"})
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            attachments,
            todoChecklist,
        });

        res.status(201).json({ message: "Tarefa criada com sucesso", task });

    } catch (error) {
        res.status(500).json({ message: "Erro de Servidor", error: error.message });
    }
};

// @desc    Update task details 
// @route   PUT /api/tasks/:id
// @access  Private 
const updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task)
            res.status(404).json({ message: "Tarefa não encontrada" });

        task.title = req.body.title || task.title;
        task.description = req.body.description || task.description;
        task.priority = req.body.priority || task.priority;
        task.dueData = req.body.dueData || task.dueData;
        task.todoChecklist = req.body.todoChecklist || task.todoChecklist;
        task.attachments = req.body.attachments || task.attachments;

        if (req.body.assignedTo) {
            if(!Array.isArray(req.body.assignedTo)) {
                return res
                .status(400)
                .json({message: "assignedTo deve ser um array de IDs de usuários"})
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updatedTask = await task.save();
        res.json({ message: "Tarefa editada com sucesso", updatedTask})
    } catch (error) {
        res.status(500).json({ message: "Erro de Servidor", error: error.message });
    }
};

// @desc    Delete a task (apenas Admin)
// @route   DELETE /api/tasks/:id
// @access  Private 
const deleteTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task)
            res.status(404).json({ message: "Tarefa não encontrada" });

        await task.deleteOne();
        res.json({ message: "Tarefa deletada com sucesso" });
    } catch (error) {
        res.status(500).json({ message: "Erro de Servidor", error: error.message });
    }
};

// @desc    Update task status
// @route   PUT /api/tasks/:id/status
// @access  Private 
const updateTaskStatus = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);

        if (!task)
            res.status(404).json({ message: "Tarefa não encontrada" });

        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString() === req.user._id.toString()
        );

        if(!isAssigned && req.user.role !== "admin") {
            res.status(403).json({ message: "Não autorizado"});
        }

        task.status = req.body.status || task.status;

        if (task.status === "Completed") {
            task.todoChecklist.forEach((item) => (item.completed = true));
            task.progress = 100;
        }

        await task.save();
        res.json({ message: "Status da tarefa atualizado", task});
        
    } catch (error) {
        res.status(500).json({ message: "Erro de Servidor", error: error.message });
    }
};

// @desc    Update task checklist
// @route   PUT /api/tasks/:id/todo
// @access  Private 
const updateTaskChecklist = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Erro de Servidor", error: error.message });
    }
};

// @desc    Dashboard data (apenas Admin)
// @route   GET /api/tasks/dashboard-data
// @access  Private 
const getDashboardData = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Erro de Servidor", error: error.message });
    }
};

// @desc    Dashboard data (Usuário específico)
// @route   GET /api/tasks/user-dashboard-data
// @access  Private 
const getUserDashboardData = async (req, res) => {
    try {
        
    } catch (error) {
        res.status(500).json({ message: "Erro de Servidor", error: error.message });
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData,
};