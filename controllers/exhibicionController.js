import Exhibicion from "../models/Exhibiciones.js";
import Pedido from "../models/Pedidos.js"
import {eliminarImagenDeS3} from "../helpers/uploads.js"
import Usuario from "../models/Usuario.js";
import mongoose from "mongoose";


const obtenerExhibiciones = async (req, res) => {
    try {
        const exhibiciones = await Exhibicion.find({
            '$or': [
                { mercaderistas: { $in: req.usuario }},
                { creador: { $in: req.usuario }},
            ],
        })
        res.json(exhibiciones);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hubo un error al obtener las exhibiciones" });   
    }
};


const nuevaExhibicion = async (req, res) => {
    // Crear un nuevo documento de exhibición con los datos del cuerpo de la solicitud
    const exhibicion = new Exhibicion(req.body);

    // Verificar si se proporcionó un ID de usuario válido
    if (!req.usuario || !req.usuario._id) {
        return res.status(400).json({ msg: 'ID de usuario inválido' });
    }

    // Asignar el creador de la exhibición
    exhibicion.creador = req.usuario._id;

    // Si se ha subido una imagen, guarda su ruta en el documento
    if (!req.file || !req.file.location) {
        return res.status(400).json({ msg: 'La imagen es obligatoria' });
    } else {
        exhibicion.imagen = req.file.location;
    }

    try {
        // Guardar el nuevo documento de exhibición en la base de datos
        const exhibicionAlmacenada = await exhibicion.save();

        // Responder con el documento almacenado
        res.status(201).json(exhibicionAlmacenada);
    } catch (error) {
        // Registrar cualquier error que ocurra durante el proceso
        console.log(error);

        // Responder con un mensaje de error
        res.status(500).json({ msg: 'Hubo un error al crear la exhibición' });
    }
};


const obtenerExhibicion = async (req, res) => {
    try {
        const { id } = req.params;
        const exhibicion = await Exhibicion.findById(id).populate("mercaderistas", "nombre email");

        if(!exhibicion){
            const error = new Error("No Existe");
            return res.status(404).json({ msg: error.message });
        }
        
        if(exhibicion.creador.toString() !== req.usuario._id.toString()){
            const error = new Error("Accion no valida");
            return res.status(401).json({ msg: error.message });
        }
   
        res.json(
            exhibicion,  
        );
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hubo un error al obtener la exhibición" });
    }
};


const editarExhibicion = async (req, res) => {
   try {
        const { id } = req.params;
        const exhibicion = await Exhibicion.findById(id);

        if(!exhibicion){
            const error = new Error("No Existe");
            return res.status(404).json({ msg: error.message });
        }
        
        if(exhibicion.creador.toString() !== req.usuario._id.toString()){
            const error = new Error("Accion no valida");
            return res.status(401).json({ msg: error.message });
        }

        exhibicion.nombre = req.body.nombre || exhibicion.nombre;
        exhibicion.descripcion = req.body.descripcion || exhibicion.descripcion;
        exhibicion.marca = req.body.marca || exhibicion.marca;
        exhibicion.desde_fecha = req.body.desde_fecha || exhibicion.desde_fecha;
        exhibicion.hasta_fecha = req.body.hasta_fecha || exhibicion.hasta_fecha;
        exhibicion.precio_alquiler = req.body.precio_alquiler || exhibicion.precio_alquiler;

        try {
            const exhibicionAlmacenada = await exhibicion.save()
            res.json(exhibicionAlmacenada);
        } catch (error) {
            console.log(error)
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hubo un error al editar la exhibición" });
    }
};

const eliminarExhibicion = async (req, res) => {
    const { id } = req.params;
    const exhibicion = await Exhibicion.findById(id);

    if (!exhibicion) {
        const error = new Error("No Existe");
        return res.status(404).json({ msg: error.message });
    }

    if (exhibicion.creador.toString() !== req.usuario._id.toString()) {
        const error = new Error("Accion no valida");
        return res.status(401).json({ msg: error.message });
    }

    try {
        // Eliminar la imagen de S3 si existe
        if (exhibicion.imagen) {
            await eliminarImagenDeS3(exhibicion.imagen);
        }

        // Eliminar la exhibición de la base de datos
        await exhibicion.deleteOne();

        res.json({ msg: "Exhibicion Eliminada" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: "Error al eliminar la exhibición" });
    }
};


const buscarMercaderista = async (req, res) => {
    const {email} = req.body
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');

    if(!usuario) {
        const error = new Error ('Usuario no encontrado')
        return res.status(404).json({ msg: error.message })
    }
    res.json(usuario);
};

const agregarMecraderista = async (req, res) => {
    const exhibicion = await Exhibicion.findById(req.params.id);
    
    if(!exhibicion){
        const error = new Error("Exhibicion no Encontrada");
        return res.status(404).json({msg: error.message});
    }

    if(exhibicion.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes permiso para agregar mercaderista a esta exhibicion");
        return res.status(404).json({msg: error.message});
    }
    const {email} = req.body
    const usuario = await Usuario.findOne({email}).select('-confirmado -createdAt -password -token -updatedAt -__v');

    if(!usuario) {
        const error = new Error ('Usuario no encontrado')
        return res.status(404).json({ msg: error.message })
    }

    //El mercaderista no es el creador de la exhibicion
    if(exhibicion.creador.toString() === usuario._id.toString()){
        const error = new Error ('El creador de la exhibición no puede ser mercaderista')
        return res.status(404).json({ msg: error.message })
    }

    //Revisar que no este agregado a la exhibicion
    if(exhibicion.mercaderistas.includes(usuario._id)){
        const error = new Error ('El usuario ya esta agregado')
        return res.status(404).json({ msg: error.message })
    }

    //Agregarlo
    exhibicion.mercaderistas.push(usuario._id);
    await exhibicion.save()
    res.json({msg: 'Usuario Agregado Correctamente'});
    
};

const eliminarMercaderista = async (req, res) => {
    const exhibicion = await Exhibicion.findById(req.params.id);
    
    if(!exhibicion){
        const error = new Error("Exhibicion no Encontrada");
        return res.status(404).json({msg: error.message});
    }

    if(exhibicion.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("No tienes permiso para agregar mercaderista a esta exhibicion");
        return res.status(404).json({msg: error.message});
    }

    //Eliminar
    exhibicion.mercaderistas.pull(req.body.id);
    await exhibicion.save();
    res.json({msg: 'Usuario Eliminado Correctamente'});

};

const reporteExhibicion = async (req, res) => {
    const reportProducts = await Pedido.aggregate([
        {
            $match:
            {
                exhibicion: new mongoose.Types.ObjectId(
                    req.params.id
                ),
            },
        },
        {
            $unwind:
            {
                path: "$productos",
            },
        },
        {
            $replaceRoot:
            {
                newRoot: "$productos",
            },
        },
        {
            $group:
            {
                _id: "$nombre",
                total: {
                    $sum: "$subtotal",
                },
                count: {
                    $sum: "$cantidad",
                },
            },
        },
        {
            $sort:
            {
                total: -1,
            },
          }
    ]).exec();

    const ventas = await Pedido.aggregate([
        {
          $group:
            {
              _id: "",
              total: {
                $sum: "$total",
              },
            },
        },
    ]).exec();

    const ventasSemana = await Pedido.aggregate([
        {
            $sort:
            {
                createdAt: -1,
            },
        },
        {
            $group:
            {
                _id: {
                    $week: "$createdAt",
                },
                total: {
                    $sum: "$total",
                },
            },
        },
        {
            $sort:
            {
                total: -1,
            },
        },
        {
            $limit:
                8,
        },
    ]).exec();

    res.json({reportProducts, ventas: {
        total: ventas[0].total,
    }, ventasSemana });
}

export{
    obtenerExhibicion,
    nuevaExhibicion,
    obtenerExhibiciones,
    editarExhibicion,
    eliminarExhibicion,
    agregarMecraderista,
    eliminarMercaderista,
    buscarMercaderista,
    reporteExhibicion
}