import  express  from "express";
import dotenv from "dotenv";
import conectarDB from "./config/db.js";
import usuarioRoutes from './routes/usuarioRoutes.js'
import exhibicionRoutes from './routes/exhibicionRoutes.js'
import productoRoutes from './routes/productoRoutes.js'
import pedidoRoutes from './routes/pedidoRoutes.js'


const app = express();
app.use(express.json());

dotenv.config();

conectarDB();

//Routing
app.use("/api/usuarios", usuarioRoutes);
app.use("/api/exhibiciones", exhibicionRoutes);
app.use("/api/productos", productoRoutes);
app.use("/api/pedidos", pedidoRoutes);

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});