//Imports and Intailiztions
const express = require("express");
const server = express();
const port = 3000;
const mongoose = require("mongoose");
const cors = require("cors");
const Product = require("./models/product");

require("dotenv").config();
const { DB_URI } = process.env;

// Middleware
server.use(express.json());
server.use(cors());
server.use(express.urlencoded({ extended: true }));

// DB Connect and Server Start
mongoose
  .connect(DB_URI)
  .then((res) => {
    server.listen(port, () => {
      console.log(`DB Connected\n  Server is Listening on Port ${port}`);
    });
  })
  .catch((error) => {
    console.log(error.message);
  });

// Routing

server.get("/", (request, response) => {
  response.send("LIVE");
});

server.get("/products", async (request, response) => {
  try {
    await Product.find().then((result) => response.send(result));
  } catch (error) {
    console.log(error.message);
  }
});

// Adding A New Product to MongoDB
server.post("/add-products", async (request, response) => {
  const { productName, brand, image, price } = request.body;

  const newProduct = new Product({
    productName,
    brand,
    image,
    price,
    id: crypto.randomUUID(),
  });
  console.log(newProduct);
  try {
    await newProduct.save();
    response.status(201).json({ message: "Product added successfully" });
  } catch (error) {
    response.status(400).json({ message: error.message });
  }
});

// Deleteing Products from MongoDB
server.delete("/delete-product/:id", async (request, response) => {
  const { id } = request.params;
  const objectId = new mongoose.Types.ObjectId(id);
  console.log(id);
  await Product.findById(objectId).then((result) => console.log(result));
  try {
    await Product.findByIdAndDelete(objectId);
    response.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    response.status(408).json({ message: "NOT" });
  }
});

// Editing Products from MongoDB
server.patch("/products/:prodId", async (request, response) => {
  const { prodId } = request.params;
  const { productName, brand, image, price, id } = request.body;
  // const objectId = new mongoose.Types.ObjectId(id);
  try {
    await Product.findByIdAndUpdate(prodId, {
      productName,
      brand,
      image,
      price,
      id,
    }).then((response) => {
      console.log(response);
    });

    await response
      .status(200)
      .json({ message: "Product updated successfully" });
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
});
