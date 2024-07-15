import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { Product } from "./models/Product.js";
import authRoutes from "./routes/auth.js";
import productsRoutes from "./routes/product.js";
import cookieParser from "cookie-parser";
import path from "path";
import url from "url";
import methodOverride from "method-override";
dotenv.config();

const port = process.env.PORT || 3000;

const app = express();

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(__dirname);

app.use(methodOverride('_method'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.set("view engine", "ejs");

const connectDb = () => {
  mongoose
    .connect(process.env.MONGO_URL)
    .then(() => {
      console.log("MongoDB Connection established");
      app.listen(port, () => {
        console.log(`Server running on port ${port}`);
      });
    })
    .catch((err) => console.log("Couldn't connect to MongoDB"));
};

// Routes
app.use("/", authRoutes);
app.use("/products", productsRoutes);

app.get("/", (req, res) => {
  res.render("index");
});

connectDb();
