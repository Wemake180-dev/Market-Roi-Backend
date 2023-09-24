import mongoose from 'mongoose'

const exhibicionesSchema = mongoose.Schema({
    nombre:{
        type: String,
        trim: true,
        require: true,
    },
    descripcion: {
        type: String,
        trim: true,
        require: true,
    },
    marca: {
        type: String,
        trim: true,
        require: true,
    },
    ubicacion: {
        type: String,
        trim: true,
        require: true,
    },
    desde_fecha: {
        type: Date,
        require: true,
    },
    hasta_fecha: {
        type: Date,
        require: true,
    },
    mercado: {
        type: String,
        trim: true,
        require: true,
    },
    precio_alquiler :{
        type: Number,
        require: true,
    },
    creador: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Usuario",
    },
    imagen: {
        type: String,
    },
    mercaderistas:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Usuario",
        },
    ],
}, {
    
    timestamps: true,

   }
);

const Exhibicion = mongoose.model("Exhibicion", exhibicionesSchema, "exhibiciones");
export default Exhibicion;