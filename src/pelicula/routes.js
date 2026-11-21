
import express from "express";

import {
    handleInsertPeliculaRequest,
    handleGetPeliculasRequest,
    handleGetPeliculaByIdRequest,
    handleUpdatePeliculaByIdRequest,
    handleDeletePeliculaByIdRequest
} from "./controller.js";

// Instancia del enrutador de películas
const peliculaRoutes = express.Router();

// Registrar una película
peliculaRoutes.post(
    "/pelicula",
    handleInsertPeliculaRequest
);

// Obtener todas las películas
peliculaRoutes.get(
    "/peliculas",
    handleGetPeliculasRequest
);

// Obtener una película por ID
peliculaRoutes.get(
    "/pelicula/:id",
    handleGetPeliculaByIdRequest
);

// Actualizar una película por ID
peliculaRoutes.put(
    "/pelicula/:id",
    handleUpdatePeliculaByIdRequest
);

// Eliminar una película por ID
peliculaRoutes.delete(
    "/pelicula/:id",
    handleDeletePeliculaByIdRequest
);

export default peliculaRoutes;
