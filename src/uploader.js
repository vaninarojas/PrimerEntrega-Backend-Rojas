import multer from 'multer';
import config from './config.js';


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, config.UPLOAD_DIR);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

export const multerConfig = multer({ storage: storage });

export function uploadMiddleware(req, res, next) {
    multerConfig.single('thumbnail')(req, res, function (err) {
        if (err instanceof multer.MulterError) {
            
            return res.status(400).send({ status: 0, message: "Error al cargar el archivo" });
        } else if (err) {
         
            return res.status(500).send({ status: 0, message: "Error interno del servidor" });
        }
        next();
    });
}
