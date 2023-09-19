import express from "express";
import{
    agregarPedido,
    obtenerPedido,
    eliminarPedido,
    cambiarEstado,
} from "../controllers/pedido.Controller.js";
import checkAuth from "../middleware/checkAuth.js";


const router = express.Router();

router.post("/", checkAuth, agregarPedido);
router
    .route("/:id")
    .get(checkAuth, obtenerPedido)
    .delete(checkAuth, eliminarPedido);
router.post("/estado/:id",checkAuth, cambiarEstado);

export default router;