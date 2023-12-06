import express  from "express";
import fs from "fs";
import http from "http";
import https from "https";
import dotenv from "dotenv";
import cors from "cors";
import conectarDB from "./config/db.js";
import usuarioRoutes from './routes/usuarioRoutes.js'
import exhibicionRoutes from './routes/exhibicionRoutes.js'
import productoRoutes from './routes/productoRoutes.js';
import pedidoRoutes from './routes/pedidoRoutes.js';
import mercadoRoutes from './routes/mercadoRoutes.js';

dotenv.config();


const httpsServerOptions = {
    key: fs.readFileSync(process.env.KEY_PATH, 'utf8'),
    cert: fs.readFileSync(process.env.CERT_PATH, 'utf8'),
};


const app = express();
app.use(express.json());

conectarDB();

//Configurar CORS
// const whitelist = [
//     process.env.FRONTEND_URL_LOCAL,
//     process.env.FRONTEND_URL_VERCEL,
//     '186.73.164.156'
// ];

// const corsOptions = {
//     origin: true, // Publico
// };

// const corsOptions = {
//     origin: function(origin, callback) {
//         if (!origin || whitelist.includes(origin)) {
//             callback(null, true);
//         } else {
//             callback(new Error("Error de Cors"));
//         }
//     },
// };
app.use(cors());

// app.use((req, res, next) => {
//     res.header('Access-Control-Allow-Origin', '*');
//     next();
// });

app.get('/', function(req, res) {
  res.send('Bienvenido');
});

//Routing
app.use((req, res, next) => {
    if (req.secure) next(); else res.redirect(`https://${req.headers.host}${req.url}`);
});

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/exhibiciones", exhibicionRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/pedidos", pedidoRoutes);
app.use("/api/mercados", mercadoRoutes);


const HTTP_PORT = process.env.HTTP_PORT || 4000;
const HTTPS_PORT = process.env.HTTPS_PORT || 443;
const IP = process.env.IP;
const serverHttp = http.createServer(app)
const serverHttps = https.createServer(httpsServerOptions, app)

serverHttp.listen(HTTP_PORT, IP, () => {
    console.log(`Servidor corriendo en el puerto ${HTTP_PORT}`);
});

serverHttps.listen(HTTPS_PORT, IP, () => {
    console.log(`Servidor corriendo en el puerto ${HTTPS_PORT}`);
});
