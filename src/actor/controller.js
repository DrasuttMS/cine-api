
import { ObjectId, Int32 } from "mongodb";
import { getDB } from "../common/db.js";
import { Actor } from "./actor.js";

// Colecciones de MongoDB
const actorCollection = getDB().collection("actores");
const peliculaCollection = getDB().collection("peliculas");

// Campos definidos en el schema Actor
const camposActor = Object.keys(Actor);

// 1. Registrar un actor o actriz
export const handleInsertActorRequest = async (req, res) => {
    try {
        const { idPelicula, nombre, edad, estaRetirado, premios } = req.body;

        // Validar los datos recibidos
        if (
            typeof idPelicula !== "string" ||
            !/^[0-9a-fA-F]{24}$/.test(idPelicula) ||
            typeof nombre !== "string" ||
            nombre.trim() === "" ||
            !Number.isInteger(edad) ||
            edad < 0 ||
            edad > 2147483647 ||
            typeof estaRetirado !== "boolean" ||
            !Array.isArray(premios)
        ) {
            return res.status(400).json({
                mensaje: "Los datos del actor son inválidos."
            });
        }

        // Verificar que la película exista mediante su ID
        const pelicula = await peliculaCollection.findOne({
            _id: new ObjectId(idPelicula)
        });

        if (!pelicula || typeof pelicula.nombre !== "string" || pelicula.nombre.trim() === "") {
            return res.status(400).json({
                mensaje: "La película indicada no existe o no tiene un nombre válido."
            });
        }

        // Construir documento según el schema Actor
        const nuevoActor = {
            _id: new ObjectId(),
            idPelicula: idPelicula,
            nombre: nombre.trim(),
            edad: new Int32(edad),
            estaRetirado: estaRetirado,
            premios: premios
        };

        // Insertar registro en MongoDB
        actorCollection.insertOne(nuevoActor)
            .then(resultado => {
                return res.status(201).json({
                    mensaje: "Actor registrado correctamente.",
                    id: resultado.insertedId,
                    pelicula: pelicula.nombre
                });
            })
            .catch(error => {
                console.error("Error al insertar actor:", error);
                return res.status(500).json({
                    mensaje: "Error al registrar el actor."
                });
            });

    } catch (error) {
        console.error("Error en handleInsertActorRequest:", error);
        return res.status(500).json({
            mensaje: "Error interno al procesar la solicitud."
        });
    }
};

// 2. Obtener todos los actores
export const handleGetActoresRequest = async (req, res) => {
    try {
        actorCollection.find({}).toArray()
            .then(actores => {
                return res.status(200).json(actores);
            })
            .catch(error => {
                console.error("Error al consultar actores:", error);
                return res.status(500).json({
                    mensaje: "Error al obtener los actores."
                });
            });

    } catch (error) {
        console.error("Error en handleGetActoresRequest:", error);
        return res.status(500).json({
            mensaje: "Error interno al consultar actores."
        });
    }
};

// 3. Obtener un actor por su ID
export const handleGetActorByIdRequest = async (req, res) => {
    try {
        const { id } = req.params;

        if (!ObjectId.isValid(id) || !/^[0-9a-fA-F]{24}$/.test(id)) {
            return res.status(400).json({
                mensaje: "El ID del actor no tiene un formato válido."
            });
        }

        const actorId = new ObjectId(id);

        actorCollection.findOne({ _id: actorId })
            .then(actor => {
                if (!actor) {
                    return res.status(404).json({
                        mensaje: "No se encontró el actor solicitado."
                    });
                }

                return res.status(200).json(actor);
            })
            .catch(error => {
                console.error("Error al buscar actor:", error);
                return res.status(500).json({
                    mensaje: "Error al consultar el actor."
                });
            });

    } catch (error) {
        console.error("Error en handleGetActorByIdRequest:", error);
        return res.status(500).json({
            mensaje: "Error interno al consultar el actor."
        });
    }
};

// 4. Obtener actores asociados a una película
export const handleGetActoresByPeliculaIdRequest = async (req, res) => {
    try {
        const { pelicula } = req.params;

        if (
            !ObjectId.isValid(pelicula) ||
            !/^[0-9a-fA-F]{24}$/.test(pelicula)
        ) {
            return res.status(400).json({
                mensaje: "El ID de la película no tiene un formato válido."
            });
        }

        const peliculaId = new ObjectId(pelicula);

        // Verificar que la película exista
        const peliculaEncontrada = await peliculaCollection.findOne({
            _id: peliculaId
        });

        if (!peliculaEncontrada) {
            return res.status(404).json({
                mensaje: "No se encontró la película solicitada."
            });
        }

        // idPelicula se almacena como String en el schema Actor
        actorCollection.find({
            idPelicula: peliculaId.toString()
        }).toArray()
            .then(actores => {
                return res.status(200).json(actores);
            })
            .catch(error => {
                console.error("Error al consultar actores por película:", error);
                return res.status(500).json({
                    mensaje: "Error al obtener los actores de la película."
                });
            });

    } catch (error) {
        console.error("Error en handleGetActoresByPeliculaIdRequest:", error);
        return res.status(500).json({
            mensaje: "Error interno al consultar actores por película."
        });
    }
};
