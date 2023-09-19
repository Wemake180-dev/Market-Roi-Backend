import mongoose from 'mongoose'

const PedidoSchema = new mongoose.Schema({
    fecha: {
        type: Date,
        required: true,
        default: Date.now()
    },
    
    exhibicion: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exhibicion', 
    },
    productos: [
        {
            producto: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Producto', 
            },
            nombre:{
                type: String
            },
            cantidad: {
                type: Number,
                default: 1
            },
                precioUnitario: {
                type: mongoose.Types.Decimal128
            },
                subtotal: {
                type: mongoose.Types.Decimal128
            }
        }
    ],

    total: {
        type: mongoose.Types.Decimal128,
        default: 0,
    },

    estado: {
        type: Boolean,
        default: false,
    }

}, { timestamps: true }); 



const Pedido = mongoose.model('Pedido', PedidoSchema);
export default Pedido;
