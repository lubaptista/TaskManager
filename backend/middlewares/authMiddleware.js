const jwt = require("jsonwebtoken");
const User = require("../models/User");

//Middleware para proteger rotas
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;

        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1]; //Extração do token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = await User.findById(decoded.id).select("-password");
            next();
        } else {
            res.status(401).json({ message: "Sem autorização, sem token" });
        }
    } catch (error) {
        res.status(401).json({ message: "Falha no token", error: error.message });
    }
};

//Middleware para rotas acessíveis apenas para Administrador 
const adminOnly = (req, res, next) => {
    if ( req.user && req.user.role === "admin") {
        next();
    } else {
        res.status(403).json({ message: "Acesso negado, apenas administradores" });
    }
};

module.exports = { protect, adminOnly };