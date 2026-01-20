import express from "express";
import cors from "cors";
import "./models/MemeMuseumDB.js"

const app = express();
const PORT = 3030;

app.use(cors());

app.use(express.json());

