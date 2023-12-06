import express from "express";
import {
    obtenerExhibicion,
    nuevaExhibicion,
    obtenerExhibiciones,
    editarExhibicion,
    eliminarExhibicion,
    agregarMecraderista,
    eliminarMercaderista,
    buscarMercaderista,
    reporteExhibicion
} from '../controllers/exhibicionController.js';
import checkAuth from '../middleware/checkAuth.js';
import upload from "../helpers/uploads.js";

const router = express.Router();


router
    .route("/")
    .get(checkAuth, obtenerExhibiciones)
    .post(checkAuth, upload.single('imagen'), nuevaExhibicion);
router 
    .route("/:id")
    .get(checkAuth, obtenerExhibicion)
    .put(checkAuth, editarExhibicion)
    .delete(checkAuth, eliminarExhibicion);   
    
router.get("/:id/reporte", checkAuth, reporteExhibicion);   
router.post("/mercaderistas", checkAuth, buscarMercaderista);   
router.post("/mercaderistas/:id", checkAuth, agregarMecraderista);  
router.post("/eliminar-mercaderista/:id", checkAuth, eliminarMercaderista);   




export default router;