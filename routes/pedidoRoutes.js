import express from "express";
import{
    agregarPedido,
    obtenerPedido,
    eliminarPedido,
    cambiarEstado,
    obtenerPedidosExhibicion,
    obtenerPedidos,
} from "../controllers/pedido.Controller.js";
import checkAuth from "../middleware/checkAuth.js";


const router = express.Router();

router
    .route("/")
    .get(checkAuth, obtenerPedidos)
    .post(checkAuth, agregarPedido);
router
    .route("/:id")
    .get(checkAuth, obtenerPedido)
    .delete(checkAuth, eliminarPedido);
router.post("/estado/:id",checkAuth, cambiarEstado);
router.get("/exhibicion/:id", checkAuth, obtenerPedidosExhibicion)

export default router;