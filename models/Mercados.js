import mongoose from 'mongoose'

const MercadoSchema = new mongoose.Schema({
    nombre: {
        type: String,
        trim: true,
        unique: true,
        required: true,
    },
    direccion: {
        type: String,
        trim: true,
        required: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
    },

}, { timestamps: true });

const Mercado = mongoose.model('Mercado', MercadoSchema);

export default Mercado;
