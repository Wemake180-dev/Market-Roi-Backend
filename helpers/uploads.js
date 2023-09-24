import multer from "multer";
import AWS from "aws-sdk";
import multerS3 from "multer-s3";
import path from 'path';

// Configurar Amazon S3
const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION
});

// Configurar multer y Amazon S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'market-roi-images',
        key: function (req, file, cb) {
            const ext = path.extname(file.originalname); // Obtener la extensión del archivo original
            cb(null, Date.now().toString() + ext)
        }
    })
});

export default upload;