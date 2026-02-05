import express from "express";
import morgan from "morgan";
import cors from "cors";
import swaggerUI from "swagger-ui-express";
import YAML from "yamljs"
import * as OpenApiValidator from "express-openapi-validator";

import { database } from "./models/MemeMuseumDB.js";

import { checkNonEmptyBodyFields } from "./utils/emptyBodyUtils.js"
import { enforceAuthentication } from "./middleware/authMiddleware.js";

import { authRouter } from "./routes/authRouter.js";
import { userRouter } from "./routes/userRouter.js";
import { memeRouter } from "./routes/memeRouter.js";
import { voteRouter } from "./routes/voteRouter.js";
import { commentRouter } from "./routes/commentRouter.js";

const app = express();
const PORT = process.env.PORT;

app.use(morgan('dev'));
app.use(cors());
app.use(express.static("uploads")); //file statici dalla cartella uploads
app.use(express.json());
app.use(checkNonEmptyBodyFields);

const apiSpec = YAML.load("./openapi.yaml");
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(apiSpec));

//middleware per la validazione delle richieste/risposte su swagger
app.use(
  OpenApiValidator.middleware({
    apiSpec: "openapi.yaml",
    validateRequests: true,
    validateResponses: false,
  })
);


//Routes //(inserire qui gli import e le definizioni delle rotte)
app.use("/api/auth", authRouter);
app.use("/api", memeRouter);
app.use(enforceAuthentication);
app.use("/api", voteRouter);
app.use("/api", commentRouter);
app.use("/api", userRouter);


//error handler generale
app.use((err, req, res, next) => {
  console.log(err.stack);
  if (err.code === 'LIMIT_FILE_SIZE') {
    res.status(400).json({ error: err.message });
  }
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
