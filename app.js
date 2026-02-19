import express from "express";
import dotenv from "dotenv";
import notFound from "./middleware/not-found.js";
import errorHandlerMiddleware from "./middleware/error-handler.js";
import connectDB from "./db/connect.js";
import productsRouter from "./routes/products.js";
import "express-async-errors";

dotenv.config();

const app = express();

// middleware
app.use(express.json());

// routes
app.get("/", (req, res) => {
  res.send(
    "<h1>Store Api</h1> <a href='/api/vi/products'>Products Route </a> "
  );
});

app.use("/api/v1/products", productsRouter);

// Products Routes
app.use(notFound);
app.use(errorHandlerMiddleware);

const PORT = process.env.PORT || 6000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(PORT, console.log(`Server is listening to the port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
