import mongoose from 'mongoose'

const PedidoSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
        default: Date.now
    },
    
    exhibicion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exhibicion', 
    },

    creador: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario', 
    },
    
    productos: [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto', 
            },
            nombre:{
                type: String,
            },
            cantidad: {
                type: Number,
                default: 1
            },
                precioUnitario: {
                type: Number,
            },
                subtotal: {
                type: Number,
            }
        }
    ],

    total: {
        type: Number,
        default: 0,
    },
    imagen: {
        type: String,
    },

    estado: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true }); 



const Pedido = mongoose.model('Pedido', PedidoSchema);
export default Pedido;
