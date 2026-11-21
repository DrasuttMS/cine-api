import "dotenv/config";

import {
    MongoClient,
    ServerApiVersion
} from "mongodb";

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true
    }
});

let database;

export const connectDB = async () => {
    try {
        await client.connect();

        await client.db("admin").command({
            ping: 1
        });

        console.log("Conexión a MongoDB Atlas exitosa");

        database = client.db("cine-db");

        return database;

    } catch (error) {
        console.error(
            "Error al conectar con MongoDB Atlas:",
            error.message
        );

        throw error;
    }
};

export const getDB = () => {
    if (!database) {
        throw new Error("La base de datos no está conectada");
    }

    return database;
};

export const closeDB = async () => {
    await client.close();
};