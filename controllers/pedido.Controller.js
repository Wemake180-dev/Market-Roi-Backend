import Exhibicion from "../models/Exhibiciones.js";
import Usuario from "../models/Usuario.js";
import Producto from "../models/Productos.js"
import Pedido from "../models/Pedidos.js";

const calcularTotalYProductos = async (productos) => {
    let totalPedido = 0;
    const productosConPrecio = await Promise.all(productos.map(async (item) => {
        const productoDB = await Producto.findById(item.id);
        
        if (!productoDB) {
            throw new Error(`Producto con ID ${item.id} no encontrado`);
        }
        
        const precioUnitario = productoDB.precio_venta;
        const nombreProducto = productoDB.nombre;
        const subtotal = precioUnitario * item.cantidad;
        
        totalPedido += subtotal;
        
        return {
            producto: item.producto,
            nombre: nombreProducto,
            cantidad: item.cantidad,
            precioUnitario,
            subtotal
        };
    }));
    totalPedido = parseFloat(totalPedido.toFixed(2));

    return { totalPedido, productosConPrecio };
}



const agregarPedido = async (req, res, next) => {
    try {
        const { exhibicion, productos } = req.body;

        const pedido = new Pedido({
            exhibicion,
            productos: [],
            total: 0,
            creador: req.usuario._id,
        });

        const existeExhibicion = await Exhibicion.findById(exhibicion);
        
        if (!existeExhibicion) {
            return res.status(404).json({ msg: "La Exhibición no existe" });
        }
        
        const { totalPedido, productosConPrecio } = await calcularTotalYProductos(productos);
        
        pedido.productos = productosConPrecio;
        pedido.total = totalPedido;

        const pedidoAlmacenado = await pedido.save();
        
        res.json(pedidoAlmacenado);
    } catch (error) {
        console.error(error);
        next(error); 
    }
};


const obtenerPedido = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Utilizar populate() para incluir la información completa de la exhibición y usuario
        const pedido = await Pedido.findById(id)
            .populate('exhibicion', '-createdAt -updatedAt')
            .populate('creador', '-password -confirmado -token -createdAt -updatedAt')
            .exec();

        
        if (!pedido) {
            const error = new Error("Pedido no encontrado");
            return res.status(404).json({ msg: error.message });
        }
        
        res.json(pedido);
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Error interno del servidor" });
    }
};



const obtenerPedidos = async (req, res) => {
    try {
        const pedidos = await Pedido.find().where("creador").equals(req.usuario);

        if (pedidos.length === 0) {
            return res.status(404).json({ message: "No has creado pedidos aun." });
        }

        res.json(pedidos);
        
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Hubo un error al obtener los pedidos" });   
    }
};


const obtenerPedidosExhibicion = async (req, res) => {
    const { id } = req.params;

    try {
        // Realiza la consulta en la base de datos para encontrar pedidos con la exhibición específica
        const pedidos = await Pedido.find({ exhibicion: id });

        // Verifica si se encontraron pedidos
        if (!pedidos || pedidos.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron pedidos para la exhibición especificada' });
        }

        // Envía la respuesta con los pedidos encontrados
        res.status(200).json(pedidos);
    } catch (error) {
        // Maneja errores, en caso de que algo salga mal durante la consulta a la base de datos
        console.error(`Error al obtener los pedidos: ${error}`);
        res.status(500).json({ msg: 'Error del servidor' });
    }
    
};


const eliminarPedido = async (req, res) => {
    const { id } = req.params;
    const pedido = await Pedido.findById(id);

    if(!pedido){
        const error = new Error("Pedido No Existe");
        return res.status(404).json({msg: error.message});
    }

    try {
        await pedido.deleteOne()
        res.json({msg: "Pedido Eliminado"})
    } catch (error) {
        console.log(error)
    }

};


const cambiarEstado = async (req, res) => {};



export {
    agregarPedido,
    obtenerPedido,
    eliminarPedido,
    cambiarEstado,
    obtenerPedidosExhibicion,
    obtenerPedidos
}