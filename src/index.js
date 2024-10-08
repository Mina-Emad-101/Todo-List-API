import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import passport from "passport";
import "./strategies/local.js";
import authRouter from "./routes/auth.js";
import usersRouter from "./routes/users.js";
import tasksRouter from "./routes/tasks.js";
import mongoose from "mongoose";
import MongoStore from "connect-mongo";
import { logging } from "./utils/middlewares.js";
import "dotenv/config";
import cors from "cors";

const HOST = process.env.HOST || "127.0.0.1";
const PORT = process.env.PORT || 8000;

const app = express();

mongoose
  .connect(
    `mongodb+srv://mina:${process.env.DBPASSWORD}@cluster0.yjr3f.mongodb.net/todo?retryWrites=true&w=majority&appName=Cluster0`,
  )
  .then(() => console.log("connected to DB"))
  .catch((err) => console.log(err));

// Middlewares
app.use(express.json());
app.use(cookieParser("secret"));
app.use(
  session({
    secret: process.env.SECRET || "secret",
    saveUninitialized: false,
    resave: false,
    cookie: { maxAge: 1000 * 60 * 60 * 24 },
    store: MongoStore.create({
      client: mongoose.connection.getClient(),
    }),
  }),
);
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
app.use(logging);

// Routes
app.use(authRouter);
app.use(usersRouter);
app.use(tasksRouter);

app.listen(PORT, HOST, () => {
  console.log(`Listening on ${HOST}:${PORT}`);
});
