
import express from "express";
import cors from "cors";
import { connectDB } from "./src/common/db.js";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

// Ruta principal
app.get("/", (req, res) => {
    res.status(200).send("Bienvenido al cine Iplacex");
});

// Iniciar servidor después de conectar MongoDB
const startServer = async () => {
    try {
        await connectDB();

        // Importar rutas después de establecer la conexión
        const { default: peliculaRoutes } = await import("./src/pelicula/routes.js");
        const { default: ActorRoutes } = await import("./src/actor/routes.js");

        // Registrar rutas como middleware
        app.use("/api", peliculaRoutes);
        app.use("/api", ActorRoutes);

        app.listen(PORT, () => {
            console.log(`Servidor iniciado en http://localhost:${PORT}`);
            console.log("API REST del cine Iplacex disponible.");
        });

    } catch (error) {
        console.error("No fue posible iniciar el servidor:", error.message);
        process.exit(1);
    }
};

startServer();
