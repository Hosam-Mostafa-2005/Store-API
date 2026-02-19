// populate.js
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
import connectDB from "./db/connect.js";
import Product from "./models/product.js";

// load env vars asap
dotenv.config();

// read products.json using fs (avoid import assertions)
const products = JSON.parse(
  fs.readFileSync(path.resolve("./products.json"), "utf8")
);

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    // optional: clear existing docs
    await Product.deleteMany();
    await Product.create(products);
    console.log("Data Imported Successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Import failed:", error);
    process.exit(1);
  }
};

start();
