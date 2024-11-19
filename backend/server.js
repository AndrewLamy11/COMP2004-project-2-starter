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
