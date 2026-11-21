
import express from "express";

import {
    handleInsertActorRequest,
    handleGetActoresRequest,
    handleGetActorByIdRequest,
    handleGetActoresByPeliculaIdRequest
} from "./controller.js";

// Crear instancia de rutas para actores
const ActorRoutes = express.Router();

// Registrar un actor
ActorRoutes.post("/actor", handleInsertActorRequest);

// Obtener todos los actores
ActorRoutes.get("/actores", handleGetActoresRequest);

// Obtener un actor por su ID
ActorRoutes.get("/actor/:id", handleGetActorByIdRequest);

// Obtener actores asociados a una película
ActorRoutes.get("/actor/:pelicula", handleGetActoresByPeliculaIdRequest);

export default ActorRoutes;
