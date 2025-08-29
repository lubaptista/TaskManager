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
           statusSummary: {
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
        task.dueDate = req.body.dueDate || task.dueDate;
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
            res.status(403).json({ message: "Usuário não autorizado a alterar o status"});
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
        const { todoChecklist } = req.body;
        const task = await Task.findById(req.params.id);

        if (!task)
            return res.status(404).json({ message: "Tarefa não encontrada" });

        if(!task.assignedTo.includes(req.user._id) && req.user.role !== "admin") {
            return res.status(403).json({ message: "Usuário não autorizado a alterar a checklist"});
        }

        task.todoChecklist = todoChecklist;     // Troca para o novo checklist determinado

        // Preeenchimento automático do progresso baseado no checklist completo
        const completedCount = task.todoChecklist.filter(
            (item) => item.completed
        ).length;
        const totalItems = task.todoChecklist.length;
        task.progress = totalItems > 0 ? Math.round((completedCount / totalItems) * 100) : 0;

        // Marcação automática da tarefa como completa se todos os itens do checklist estiverem completo
        if (task.progress === 100) {
            task.status = "Completed";
        } else if (task.progress > 0) {
            task.status = "In Progress";
        } else {
            task.status = "Pending";
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        res.json({ message: "Checklist da tarefa atualizado", task: updatedTask});

    } catch (error) {
        res.status(500).json({ message: "Erro de Servidor", error: error.message });
    }
};

// @desc    Dashboard data (apenas Admin)
// @route   GET /api/tasks/dashboard-data
// @access  Private 
const getDashboardData = async (req, res) => {
    try {
        // Reunindo estatísticas
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({ status: "Pending" });
        const completedTasks = await Task.countDocuments({ status: "Completed" });
        const overdueTasks = await Task.countDocuments({ 
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
        });

        // Garantir que todos os estados possíveis foram incluídos
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistribuitionRaw = await Task.aggregate([
            { $group: { _id: "$status", count: { $sum: 1 } } },
        ]);

        const taskDistribuition = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, ""); // Remove espaços de chaves responsivas
            acc[formattedKey] = 
                taskDistribuitionRaw.find((item) => item._id === status)?.count || 0;
            return acc; 
        }, {});

        taskDistribuition["All"] = totalTasks;  // Adiciona contador total ao taskDistribuition

        // Garante que todos os níveis de prioridade estejam inclusos
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            { $group: { _id: "$priority", count: { $sum: 1 } } },
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = 
                taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc; 
        }, {});

        // Reune as 10 tarefas masi recentes
        const recentTasks = await Task.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");
        
        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribuition,
                taskPriorityLevels,
            },
            recentTasks,
        });

    } catch (error) {
        res.status(500).json({ message: "Erro de Servidor", error: error.message });
    }
};

// @desc    Dashboard data (Usuário específico)
// @route   GET /api/tasks/user-dashboard-data
// @access  Private 
const getUserDashboardData = async (req, res) => {
    try {
        const userId = req.user._id     // Busca dados apenas do usuário logado
    
        // Reune estatísticas de tarefas exclusivas do usuário
        const totalTasks = await Task.countDocuments({ assignedTo: userId });
        const pendingTasks = await Task.countDocuments({ assignedTo: userId, status: "Pending" });
        const completedTasks = await Task.countDocuments({ assignedTo: userId, status: "Completed" });
        const overdueTasks = await Task.countDocuments({ 
            assignedTo: userId,
            status: { $ne: "Completed" },
            dueDate: { $lt: new Date() },
        });

        // Distribuição das tarefas por status
        const taskStatuses = ["Pending", "In Progress", "Completed"];
        const taskDistribuitionRaw = await Task.aggregate([
            { $match: { assignedTo: userId }},
            { $group: { _id: "$status", count: { $sum: 1 }}},
        ]);

        const taskDistribuition = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g, ""); // Remove espaços de chaves responsivas
            acc[formattedKey] = 
                taskDistribuitionRaw.find((item) => item._id === status)?.count || 0;
            return acc; 
        }, {});

        taskDistribuition["All"] = totalTasks;  // Adiciona contador total ao taskDistribuition

        // Distribuição das tarefas por prioridade
        const taskPriorities = ["Low", "Medium", "High"];
        const taskPriorityLevelsRaw = await Task.aggregate([
            { $match: { assignedTo: userId }},
            { $group: { _id: "$priority", count: { $sum: 1 }}},
        ]);

        const taskPriorityLevels = taskPriorities.reduce((acc, priority) => {
            acc[priority] = 
                taskPriorityLevelsRaw.find((item) => item._id === priority)?.count || 0;
            return acc; 
        }, {});

        // Reune as 10 tarefas masi recentes
        const recentTasks = await Task.find({ assignedTo: userId })
            .sort({ createdAt: -1 })
            .limit(10)
            .select("title status priority dueDate createdAt");
        
        res.status(200).json({
            statistics: {
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts: {
                taskDistribuition,
                taskPriorityLevels,
            },
            recentTasks,
        });
    
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