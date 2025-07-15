const multer = require ('multer');

//Configuração do armazenamento 
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null,'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

//Filtro de arquivos
const fileFilter = (res, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Permitido apenas formatos .jpeg, .jpg e .png'), false);
    }
};

const upload = multer({ storage, fileFilter });

module.exports = upload;