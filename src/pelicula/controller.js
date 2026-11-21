
import { ObjectId, Int32 } from "mongodb";
import { getDB } from "../common/db.js";
import { Pelicula } from "./pelicula.js";

// Colección global de películas
const peliculaCollection = getDB().collection("peliculas");

// Campos permitidos según el schema
const camposPelicula = Object.keys(Pelicula);

// --------------------------------------------------
// 1. INSERTAR UNA PELÍCULA
// --------------------------------------------------

export const handleInsertPeliculaRequest = async (req, res) => {
    try {
        const { nombre, anioEstreno } = req.body;
        const generos = req.body["géneros"];

        if (
            typeof nombre !== "string" ||
            nombre.trim() === "" ||
            !Array.isArray(generos) ||
            !Number.isInteger(anioEstreno) ||
            anioEstreno < 0 ||
            anioEstreno > 2147483647
        ) {
            return res.status(400).json({
                mensaje: "Los datos de la película no son válidos."
            });
        }

        // Documento construido según el schema Pelicula
        const pelicula = {
            _id: new ObjectId(),
            nombre: nombre.trim(),
            "géneros": generos,
            anioEstreno: new Int32(anioEstreno)
        };

        await peliculaCollection.insertOne(pelicula)
            .then(resultado => {
                return res.status(201).json({
                    mensaje: "Película registrada correctamente.",
                    id: resultado.insertedId,
                    pelicula: pelicula
                });
            })
            .catch(error => {
                console.error("Error al insertar película:", error);

                return res.status(500).json({
                    mensaje: "Error al registrar la película."
                });
            });

    } catch (error) {
        console.error("Error en handleInsertPeliculaRequest:", error);

        return res.status(500).json({
            mensaje: "Error interno del servidor."
        });
    }
};


// --------------------------------------------------
// 2. OBTENER TODAS LAS PELÍCULAS
// --------------------------------------------------

export const handleGetPeliculasRequest = async (req, res) => {
    try {
        await peliculaCollection.find({})
            .toArray()
            .then(peliculas => {
                return res.status(200).json(peliculas);
            })
            .catch(error => {
                console.error("Error al consultar películas:", error);

                return res.status(500).json({
                    mensaje: "Error al obtener las películas."
                });
            });

    } catch (error) {
        console.error("Error en handleGetPeliculasRequest:", error);

        return res.status(500).json({
            mensaje: "Error interno del servidor."
        });
    }
};


// --------------------------------------------------
// 3. OBTENER UNA PELÍCULA POR ID
// --------------------------------------------------

export const handleGetPeliculaByIdRequest = async (req, res) => {
    try {
        const id = req.params.id;
        let objectId;

        try {
            if (!/^[0-9a-fA-F]{24}$/.test(id)) {
                throw new Error("ID inválido");
            }

            objectId = new ObjectId(id);

        } catch (error) {
            return res.status(400).json({
                mensaje: "El ID de la película tiene un formato inválido."
            });
        }

        await peliculaCollection.findOne({ _id: objectId })
            .then(pelicula => {
                if (!pelicula) {
                    return res.status(404).json({
                        mensaje: "Película no encontrada."
                    });
                }

                return res.status(200).json(pelicula);
            })
            .catch(error => {
                console.error("Error al buscar película:", error);

                return res.status(500).json({
                    mensaje: "Error al consultar la película."
                });
            });

    } catch (error) {
        console.error("Error en handleGetPeliculaByIdRequest:", error);

        return res.status(500).json({
            mensaje: "Error interno del servidor."
        });
    }
};


// --------------------------------------------------
// 4. ACTUALIZAR UNA PELÍCULA POR ID
// --------------------------------------------------

export const handleUpdatePeliculaByIdRequest = async (req, res) => {
    try {
        const id = req.params.id;
        let objectId;

        try {
            if (!/^[0-9a-fA-F]{24}$/.test(id)) {
                throw new Error("ID inválido");
            }

            objectId = new ObjectId(id);

        } catch (error) {
            return res.status(400).json({
                mensaje: "El ID de la película tiene un formato inválido."
            });
        }

        const datos = req.body;
        const camposActualizables = camposPelicula.filter(
            campo => campo !== "_id"
      );

        const camposRecibidos = Object.keys(datos);

        if (
            camposRecibidos.length === 0 ||
            camposRecibidos.some(campo =>
                !camposActualizables.includes(campo)
            )
        ) {
            return res.status(400).json({
                mensaje: "Los campos enviados no son válidos."
            });
        }

        const actualizacion = {};

        if (datos.nombre !== undefined) {
            if (
                typeof datos.nombre !== "string" ||
                datos.nombre.trim() === ""
            ) {
                return res.status(400).json({
                    mensaje: "El nombre no es válido."
                });
            }

            actualizacion.nombre = datos.nombre.trim();
        }

        if (datos["géneros"] !== undefined) {
            if (!Array.isArray(datos["géneros"])) {
                return res.status(400).json({
                    mensaje: "El campo géneros debe ser un arreglo."
                });
            }

            actualizacion["géneros"] = datos["géneros"];
        }

        if (datos.anioEstreno !== undefined) {
            if (
                !Number.isInteger(datos.anioEstreno) ||
                datos.anioEstreno < 0 ||
                datos.anioEstreno > 2147483647
            ) {
                return res.status(400).json({
                    mensaje: "El año de estreno no es válido."
                });
            }

            actualizacion.anioEstreno = new Int32(datos.anioEstreno);
        }

        await peliculaCollection.updateOne(
            { _id: objectId },
            { $set: actualizacion }
        )
            .then(resultado => {
                if (resultado.matchedCount === 0) {
                    return res.status(404).json({
                        mensaje: "Película no encontrada."
                    });
                }

                return res.status(200).json({
                    mensaje: "Película actualizada correctamente.",
                    modificada: resultado.modifiedCount > 0
                });
            })
            .catch(error => {
                console.error("Error al actualizar película:", error);

                return res.status(500).json({
                    mensaje: "Error al actualizar la película."
                });
            });

    } catch (error) {
        console.error("Error en handleUpdatePeliculaByIdRequest:", error);

        return res.status(500).json({
            mensaje: "Error interno del servidor."
        });
    }
};


// --------------------------------------------------
// 5. ELIMINAR UNA PELÍCULA POR ID
// --------------------------------------------------

export const handleDeletePeliculaByIdRequest = async (req, res) => {
    try {
        const id = req.params.id;
        let objectId;

        try {
            if (!/^[0-9a-fA-F]{24}$/.test(id)) {
                throw new Error("ID inválido");
            }

            objectId = new ObjectId(id);

        } catch (error) {
            return res.status(400).json({
                mensaje: "El ID de la película tiene un formato inválido."
            });
        }

        await peliculaCollection.deleteOne({ _id: objectId })
            .then(resultado => {
                if (resultado.deletedCount === 0) {
                    return res.status(404).json({
                        mensaje: "Película no encontrada."
                    });
                }

                return res.status(200).json({
                    mensaje: "Película eliminada correctamente."
                });
            })
            .catch(error => {
                console.error("Error al eliminar película:", error);

                return res.status(500).json({
                    mensaje: "Error al eliminar la película."
                });
            });

    } catch (error) {
        console.error("Error en handleDeletePeliculaByIdRequest:", error);

        return res.status(500).json({
            mensaje: "Error interno del servidor."
        });
    }
};
