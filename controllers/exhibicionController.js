import Exhibicion from "../models/Exhibiciones.js";
import Pedido from "../models/Pedidos.js"


const obtenerExhibiciones = async (req, res) => {
    try {
        const exhibiciones = await Exhibicion.find().where("creador").equals(req.usuario);
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
        const exhibicion = await Exhibicion.findById(id);

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

    if(!exhibicion){
        const error = new Error("No Existe");
        return res.status(404).json({ msg: error.message });
    }
    
    if(exhibicion.creador.toString() !== req.usuario._id.toString()){
        const error = new Error("Accion no valida");
        return res.status(401).json({ msg: error.message });
    }

    try {
        await exhibicion.deleteOne();
        res.json({msg: "Exhibicion Eliminada"})
    } catch (error) {
        console.log(error)
    }
};

const agregarMecraderista = async (req, res) => {};

const eliminarMercaderista = async (req, res) => {};



export{
    obtenerExhibicion,
    nuevaExhibicion,
    obtenerExhibiciones,
    editarExhibicion,
    eliminarExhibicion,
    agregarMecraderista,
    eliminarMercaderista,
    
}