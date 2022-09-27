const mongoose = require("mongoose");
const Product = require("./models/Product");
require("dotenv").config();
const getProductsFromID = async (id) => {
  return new Promise((resolve, reject) => {
    if (!mongoose.isValidObjectId(id)) resolve([]);
    Product.find({ _id: id }, function (err, product) {
      if (err) reject(new Error(err));
      resolve(product);
    });
  });
};
const getProductsFromCategory = async (category) => {
  let regex = new RegExp(category, "i");
  return new Promise((resolve, reject) => {
    Product.find({ category: { $regex: regex } }, function (err, products) {
      if (err) reject(new Error(err));
      resolve(products);
    });
  });
};
const getAllProducts = async () => {
  let products = await Product.find({});
  return products;
};
const createNewProduct = async ({
  name,
  category,
  description,
  price,
  rating,
}) => {
  return new Promise((resolve, reject) => {
    Product.create(
      { name, category, description, price, rating },
      function (err, product) {
        if (err) reject(new Error(err));
        resolve(product);
      }
    );
  });
};
const findAndDeleteProduct = async ({ _id }) => {
  return new Promise((resolve, reject) => {
    Product.findByIdAndDelete(_id, function (err, product) {
      if (err) reject(new Error(err));
      // if (!Product) reject(new Error("No Product Found"));
      resolve(product);
    });
  });
};
const findAndUpdateProduct = async ({
  _id,
  name,
  category,
  description,
  price,
  rating,
}) => {
  return new Promise((resolve, reject) => {
    Product.findOneAndUpdate(
      { _id: _id },
      { name, category, description, price, rating },
      { new: true },
      function (err, product) {
        if (err) reject(new Error(err));
        // if (!Product) reject(new Error("No Product Found"));
        resolve(product);
      }
    );
  });
};
module.exports = {
  getProductsFromCategory,
  getProductsFromID,
  getAllProducts,
  createNewProduct,
  findAndDeleteProduct,
  findAndUpdateProduct,
};
