const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Gerando JWT Token
const generateToken = (userId) => {
    return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// @desc   Registro de novo usuário
// @route   POST /api/auth/register
// @access   Publico
const registerUser = async (req, res) => {
    try {
        const { name, email, password, profileImageUrl, adminInviteToken} = req.body;

        // Checagem se usuário já existe
        const userExists = await User.findOne ({ email });
        if (userExists) {
            return res.status(400).json({ message: "Usuário já existe" });
        }

        // Determinação do cargo: admin se tiver o token ou membro 
        let role = "member";
        if ( adminInviteToken && adminInviteToken == process.env.ADMIN_INVITE_TOKEN ) {
            role = "admin";
        }

        // Senha Hash
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Criação de novo usuário
        const user = await User.create ({
           name,
           email,
           password: hashedPassword,
           profileImageUrl,
           role, 
        });

        // Retorno dados do usuário com JWT
        res.status(200).json({ 
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token:generateToken(user._id),

        });

    } catch (error) {
        res.status(500).json({ message: "Falha no servidor", error: error.message });
    }
};

// @desc   Login usuário
// @route   POST /api/auth/login
// @access   Publico
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Checagem se usuário existe com o email fornecido pelo usuário
        const user = await User.findOne ({ email });
        if (!user) {
            return res.status(401).json({ message: "Email ou senha inválidos" });
        }

        // Comparação da senha na tabela e a fornecida pelo usuário
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: "Falha no servidor", error: error.message });
        }

        // Retorno dados do usuário com JWT
        res.json({ 
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            profileImageUrl: user.profileImageUrl,
            token:generateToken(user._id),

        });

    } catch (error) {
        res.status(500).json({ message: "Falha no servidor", error: error.message });
    }
};

// @desc   Pegar perfil do usuário
// @route   POST /api/auth/profile
// @access   Privado (Requer JWT)
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Falha no servidor", error: error.message });
    }
};

// @desc   Atualizar perfil do usuário
// @route   POST /api/auth/profile
// @access   Privado (Requer JWT)
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: "Usuário não encontrado" });
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedUser = await user.save();

        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            role: updatedUser.role,
            token: generateToken (updatedUser._id),
        });

    } catch (error) {
        res.status(500).json({ message: "Falha no servidor", error: error.message });
    }
};

module.exports = {registerUser, loginUser, getUserProfile, updateUserProfile};