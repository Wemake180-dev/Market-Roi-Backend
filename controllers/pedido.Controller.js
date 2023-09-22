import Exhibicion from "../models/Exhibiciones.js";
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
    return { totalPedido, productosConPrecio };
}

const agregarPedido = async (req, res, next) => {
    try {
        const { exhibicion, productos } = req.body;
        const existeExhibicion = await Exhibicion.findById(exhibicion);
        
        if (!existeExhibicion) {
            return res.status(404).json({ msg: "La Exhibición no existe" });
        }
        
        const { totalPedido, productosConPrecio } = await calcularTotalYProductos(productos);
        
        const pedido = new Pedido({
            exhibicion,
            productos: productosConPrecio,
            total: totalPedido,
        });
        
        const pedidoAlmacenado = await pedido.save();
        
        res.json(pedidoAlmacenado);
    } catch (error) {
        console.error(error);
        next(error); 
    }
};


const obtenerPedido = async (req, res) => {
    const { id } = req.params;
    const pedido = await Pedido.findById(id);
    console.log(id)
    

    if(!pedido){
        const error = new Error("Pedido no encontrada");
        return res.status(404).json({msg: error.message});
    }
    res.json(pedido);
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
    cambiarEstado
}