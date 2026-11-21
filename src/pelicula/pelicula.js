import { ObjectId, Int32 } from "mongodb";

// Schema de películas
export const Pelicula = {
    _id: ObjectId,
    nombre: String,
    "géneros": Array,
    anioEstreno: Int32
};