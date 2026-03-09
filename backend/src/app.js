import express from "express";
import cors from "cors"
import morgan from "morgan";
const app = express();
app.use(morgan("combined"))


app.use(cors({
    origin: "*"
}))

export default app;