import Producto from "../models/Productos.js"

const agregarProducto = async (req, res) => {

    const { nombre } = req.body; 
    const productoExistente = await Producto.findOne({ nombre });

    if (productoExistente) {
        return res.status(400).json({ message: 'Ya existe un producto con el mismo nombre' });
    }
    
    const producto = new Producto(req.body)
    producto.creador = req.usuario._id

    try {
        const productoAlmacenado = await producto.save()
        res.json(productoAlmacenado);
    } catch (error) {
        console.log(error)
    }
};

const obtenerProducto = async (req, res) => {

    const { id } = req.params;

    try {
        const producto = await Producto.findById(id);
        res.json(producto);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hubo un error al obtener el producto" });
    }
};

//TODO: Verificar funcionamiento y agregar la ruta  
const obtenerProductos = async (req, res) => {
    try {
        const productos = await Producto.find();
        res.json(productos);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hubo un error al obtener las exhibiciones" });   
    }
};


const actualizarProducto = async (req, res) => {
       try {
        const { id } = req.params;
        const producto = await Producto.findById(id);

        if(!producto){
            const error = new Error("No Existe");
            return res.status(404).json({ msg: error.message });
        }

        producto.nombre = req.body.nombre || producto.nombre;
        producto.marca = req.body.marca || producto.marca;
        producto.categoria = req.body.categoria || producto.categoria;
        producto.tamaño_gr = req.body.tamaño_gr || producto.tamaño_gr;
        producto.precio_costo = req.body.precio_costo || producto.precio_costo;
        producto.precio_venta = req.body.precio_venta || producto.precio_venta;       

        try {
            const productoAlmacenado = await producto.save()
            res.json(productoAlmacenado);
        } catch (error) {
            console.log(error)
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hubo un error al editar el prodcuto" });
    }
};


const eliminarProducto = async (req, res) => {
    const { id } = req.params;
    const producto = await Producto.findById(id);

    if(!producto){
        const error = new Error("No Existe");
        return res.status(404).json({ msg: error.message });
    }

    try {
        await producto.deleteOne();
        res.json({msg: "Producto Eliminado"})
    } catch (error) {
        console.log(error)
    }
};


export {
    agregarProducto,
    obtenerProducto,
    actualizarProducto,
    eliminarProducto,
    obtenerProductos,
}