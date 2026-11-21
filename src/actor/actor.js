import { ObjectId, Int32 } from "mongodb";

// Schema de actores
export const Actor = {
    _id: ObjectId,
    idPelicula: String,
    nombre: String,
    edad: Int32,
    estaRetirado: Boolean,
    premios: Array
};