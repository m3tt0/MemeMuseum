import express from "express";
import cors from "cors";
import { database } from "./models/MemeMuseumDB.js";

import { emptyBodyMiddleware } from "./utils/emptyBodyUtils.js"
import { enforceAuthentication } from "./middleware/authorization.js";


const app = express();
const PORT = 3030;

//app.use(morgan('dev'));
app.use(cors());
app.use(express.static("uploads")); //file statici dalla cartella uploads
app.use(express.json());
app.use(emptyBodyMiddleware);
app.use(enforceAuthentication);




//Routes //(inserire qui gli import e le definizioni delle rotte)

app.use("/api/auth", authRouter);
app.use(userRouter);





//error handler generale
app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(err.status || 500).json({
    code: err.status || 500,
    description: err.message || "An error occurred",
  });
});

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