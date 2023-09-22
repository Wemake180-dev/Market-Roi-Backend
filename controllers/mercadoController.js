import Mercado from "../models/Mercados.js";

const agregarMercado = async (req, res) => {

    const { nombre } = req.body; 
    const mercadoExistente = await Mercado.findOne({ nombre });

    if (mercadoExistente) {
        return res.status(400).json({ message: 'Ya existe un mercado con el mismo nombre' });
    }
    
    const mercado = new Mercado(req.body)
    mercado.creador = req.usuario._id

    try {
        const mercadoAlmacenado = await mercado.save()
        res.json(mercadoAlmacenado);
    } catch (error) {
        console.log(error)
    }
};

const obtenerMercado = async (req, res) => {

    const { id } = req.params;

    try {
        const mercado = await Mercado.findById(id);
        res.json(mercado);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hubo un error al obtener el mercado" });
    }
};


const obtenerMercados = async (req, res) => {
    try {
        const mercados = await Mercado.find();

        if (mercados.length === 0) {
            return res.status(404).json({ message: "No se encontraron mercados." });
        }
        
        res.json(mercados);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hubo un error al obtener los mercados" });   
    }
};


const actualizarMercado = async (req, res) => {
       try {
        const { id } = req.params;
        const mercado = await Mercado.findById(id);

        if(!mercado){
            const error = new Error("No Existe");
            return res.status(404).json({ msg: error.message });
        }

        mercado.nombre = req.body.nombre || producto.nombre;
        mercado.direccion = req.body.marca || producto.marca;     

        try {
            const mercadoAlmacenado = await mercado.save()
            res.json(mercadoAlmacenado);
        } catch (error) {
            console.log(error)
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hubo un error al editar el mercado" });
    }
};


const eliminarMercado = async (req, res) => {
    const { id } = req.params;
    const mercado = await Mercado.findById(id);

    if(!mercado){
        const error = new Error("No Existe");
        return res.status(404).json({ msg: error.message });
    }

    try {
        await mercado.deleteOne();
        res.json({msg: "Mercado Eliminado"})
    } catch (error) {
        console.log(error)
    }
};


export {
    agregarMercado,
    obtenerMercado,
    actualizarMercado,
    eliminarMercado,
    obtenerMercados,
}