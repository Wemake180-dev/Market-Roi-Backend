import express from "express";

import {
    agregarProducto,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductos,
} from "../controllers/productoController.js"

import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();


router
    .route("/")
    .get(checkAuth, obtenerProductos)
    .post(checkAuth, agregarProducto);
router
    .route("/:id")
    .get(checkAuth, obtenerProducto)
    .put(checkAuth, actualizarProducto)
    .delete(checkAuth, eliminarProducto);


export default router;