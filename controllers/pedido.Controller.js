import Exhibicion from "../models/Exhibiciones.js";
import Usuario from "../models/Usuario.js";
import Producto from "../models/Productos.js"
import Pedido from "../models/Pedidos.js";
import upload from "../helpers/uploads.js";
import mongoose from "mongoose";

const calcularTotalYProductos = async (productosStr) => {  //Cambiar el nombre de productos a productosStr para probar desde postman
    let totalPedido = 0;
    console.log(productosStr)
    const productos = JSON.parse(productosStr);
    console.log(productos)

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
        // Utilizamos el middleware de multer para manejar la subida del archivo
        // 'imagen' es el nombre del campo que contendrá el archivo en la petición HTTP
            upload.single('imagen')(req, res, async (err) => {
            // Si multer encuentra un error durante la subida, respondemos con un error 500
            if (err) {
                return res.status(500).json({ msg: "Error al cargar la imagen" });
            }
            
            // Creamos un nuevo objeto Pedido
            const pedido = new Pedido();
            
            // Si se ha subido una imagen, almacenamos su ubicación en el objeto pedido
            if (req.file && req.file.location) {
                pedido.imagen = req.file.location;
            }

            // A partir de aquí, tu lógica existente para manejar los datos del pedido
            const { exhibicion, productos } = req.body;

            // Buscar si la exhibición existe
            const existeExhibicion = await Exhibicion.findById(exhibicion);
            
            // Si la exhibición no existe, devolvemos un error 404
            if (!existeExhibicion) {
                return res.status(404).json({ msg: "La Exhibición no existe" });
            }
            
            // Calculamos el total y los productos con precio
            const { totalPedido, productosConPrecio } = await calcularTotalYProductos(productos);

            // Almacenamos estos valores en el objeto pedido
            pedido.productos = productosConPrecio;
            pedido.total = totalPedido;
            pedido.exhibicion = exhibicion;
            pedido.creador = req.usuario._id;  

            // Guardamos el pedido en la base de datos
            const pedidoAlmacenado = await pedido.save();
            
            // Devolvemos el pedido almacenado como respuesta
            res.json(pedidoAlmacenado);
        });
        
    } catch (error) {
        // Si algo sale mal, imprimimos el error en la consola y pasamos el error al próximo middleware
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
        const pedidos = await Pedido.find()
                                    .where("creador").equals(req.usuario)
                                    .sort({ createdAt: -1})
                                    .populate({
                                        path: "exhibicion",
                                        select: "nombre mercado",
                                     });
                                    

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

const obtenerSumaTotalPedidosExhibicion = async (req, res) => {
    const { id } = req.params;

    try {
        // Realiza la consulta en la base de datos para encontrar pedidos con la exhibición específica
        const pedidos = await Pedido.find({ exhibicion: id });

        // Verifica si se encontraron pedidos
        if (!pedidos || pedidos.length === 0) {
            return res.status(404).json({ msg: 'No se encontraron pedidos para la exhibición especificada' });
        }

        // Calcula la suma total de los pedidos
        const suma = pedidos.reduce((total, pedido) => total + pedido.total, 0);

        // Redondea la suma total a dos decimales
        const sumaTotal = parseFloat(suma.toFixed(2));
        
        // Obtiene el conteo de los pedidos
        const conteoPedidos = pedidos.length;

        // Envía la respuesta con la suma total y el conteo de pedidos
        res.status(200).json({ sumaTotal, conteoPedidos });
    } catch (error) {
        // Maneja errores, en caso de que algo salga mal durante la consulta a la base de datos
        console.error(`Error al obtener la suma total de los pedidos: ${error}`);
        res.status(500).json({ msg: 'Error del servidor' });
    }
};

const obtenerConteoYTotalPedidosPorMes = async (req, res) => {
    const { id } = req.params; // Obtén el valor de 'id' desde la URL
  
    try {
      // Convierte el ID de la exhibición en un ObjectId válido de Mongoose
      const exhibicionId = new mongoose.Types.ObjectId(id);
  
      // Realiza la consulta en la base de datos para obtener el conteo y el total de pedidos por mes de la exhibición con el ID 'exhibicionId'
      const resultado = await Pedido.aggregate([
        {
          $match: {
            exhibicion: exhibicionId, // Filtra por la exhibición específica
          },
        },
        {
          $group: {
            _id: { $month: "$fecha" }, // Agrupa por mes
            total: { $sum: "$total" }, // Calcula la suma total
            conteo: { $sum: 1 }, // Calcula el conteo de pedidos
          },
        },
      ]);
  
      // Formatea los resultados para facilitar su uso
      const pedidosPorMes = resultado.map((item) => ({
        mes: item._id,
        total: item.total.toFixed(2),
        conteo: item.conteo,
      }));
  
      res.status(200).json(pedidosPorMes);
    } catch (error) {
      console.error(`Error al obtener el conteo y el total de pedidos por mes: ${error}`);
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
    obtenerPedidos,
    obtenerSumaTotalPedidosExhibicion,
    obtenerConteoYTotalPedidosPorMes
}