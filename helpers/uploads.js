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

// Eliminar una imagen de Amazon S3
function eliminarImagenDeS3(imagen) {
    const nombreArchivo = path.basename(imagen);
    console.log(nombreArchivo)
    return new Promise((resolve, reject) => {
        s3.deleteObject({ Bucket: 'market-roi-images', Key: nombreArchivo }, (error, data) => {
            if (error) {
                console.error('Error al eliminar la imagen de S3:', error);
                reject(error);
            } else {
                console.log('Imagen eliminada con éxito:', data);
                resolve(data);
            }
        });
    });
}

// Configurar multer y Amazon S3
const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'market-roi-images',
        key: function (req, file, cb) {
            // Antes de cargar una nueva imagen, verifica si hay una imagen existente y elimínala
            if (req.body.imagen) {
                eliminarImagenDeS3(req.body.imagen)
                    .then(() => {
                        // Continuar con la carga de la nueva imagen
                        const ext = path.extname(file.originalname);
                        cb(null, Date.now().toString() + ext);
                    })
                    .catch((error) => {
                        console.error('Error al eliminar la imagen de S3:', error);
                        cb(error);
                    });
            } else {
                // Si no hay una imagen existente, carga la nueva imagen
                const ext = path.extname(file.originalname);
                cb(null, Date.now().toString() + ext);
            }
        }
    })
});


export{
    eliminarImagenDeS3
}

export default upload