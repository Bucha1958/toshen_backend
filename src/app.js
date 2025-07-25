import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import rootRoutes from "./routes/rootRoutes.js";
import dbConnection from "../config/dbConnection.js";
import dotenv from 'dotenv';
dotenv.config();


const PORT = process.env.SERVER_PORT || 3500;

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: false }));


const allowedOrigins = [
  'https://www.toshel.org', 
  'https://toshel.org', 
  'http://localhost:3000',
  'http://localhost:5173'
];

// app.use(cors({
//   origin: (origin, callback) => {
//     if (!origin || allowedOrigins.includes(origin)) {
//       callback(null, true);
//     } else {
//       callback(new Error("Not allowed by CORS"));
//     }
//   },
//   credentials: true,
// }));

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, origin);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
}));

app.use(helmet());

app.use(compression());

app.use(cookieParser(process.env.COOKIE_SECRET));

rootRoutes(app);

app.use((req, res, next) =>
  res.status(404).json({ message: "Endpoint not found!" })
);

app.listen(PORT, async () => {
  await dbConnection();

  console.log(`Server is running at port ${PORT}`);
});
