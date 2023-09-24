import mongoose from 'mongoose'

// Schema de Producto
const ProductoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    marca: {
        type: String,
        trim: true,
        required: true,
    },
    categoria: {
        type: String,
        trim: true,
        required: true,
    },
    tamaño_gr: {
        type: Number,
        trim: true,
        required: true,
    },
    precio_costo: {
        type: Number,
        trim: true,
        required: true,
    },
    precio_venta: {
        type: Number,
        trim: true,
        required: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
    },

}, { timestamps: true });

const Producto = mongoose.model('Producto', ProductoSchema);

export default Producto;
