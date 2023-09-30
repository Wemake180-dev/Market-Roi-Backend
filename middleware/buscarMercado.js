import Mercados from "../models/Mercados.js"

const buscarMercado = async (req, res, next) => {
     const { q } = req.query;

        if (q) {
            try {
                const supermercados = await Mercados.find({
                    nombre: new RegExp(q, 'i')
                });
                return res.json(supermercados);
            } catch (error) {
                return res.status(500).json({ error: 'Error al buscar supermercados' });
            }
        }

        // Si no hay parámetro 'q', pasa al siguiente middleware
        next();
};

export default buscarMercado;