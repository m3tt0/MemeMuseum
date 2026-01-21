import express from "express";
import cors from "cors";
import { database } from "./models/MemeMuseumDB.js";

import { emptyBodyMiddleware } from "./middleware/emptyBodyMiddleware.js"


const app = express();
const PORT = 3030;

app.use(cors());
app.use(express.json());
app.uso(emptyBodyMiddleware);










//gestione del database e avvio dell'app
async function main() {
  try {
    await database.authenticate(); //eventualmente utile per integrazioni di DB diversi
    await database.sync();   
    app.listen(PORT, () => console.log(`API up on :${PORT}`));
  } catch (err) {
    console.error("DB init failed:", err);
    process.exit(1);
  }
}

main();