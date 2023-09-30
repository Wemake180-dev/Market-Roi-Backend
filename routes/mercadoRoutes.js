import express from "express";

import {
    agregarMercado,
    obtenerMercado,
    actualizarMercado,
    eliminarMercado,
    obtenerMercados,
} from "../controllers/mercadoController.js";

import checkAuth from "../middleware/checkAuth.js";
import buscarMercado from "../middleware/buscarMercado.js";

const router = express.Router();


router
    .route("/")
    .get(checkAuth, buscarMercado, obtenerMercados)
    .post(checkAuth, agregarMercado);
router
    .route("/:id")
    .get(checkAuth, obtenerMercado)
    .put(checkAuth, actualizarMercado)
    .delete(checkAuth, eliminarMercado);


export default router;