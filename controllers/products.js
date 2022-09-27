const express = require("express");
const Product = require("../models/Product");
const {
  getProductsFromID,
  getProductsFromCategory,
  getAllProducts,
  createNewProduct,
  findAndDeleteProduct,
  findAndUpdateProduct,
} = require("../helpers");
const getProductsByID = (req, res) => {
  const { id } = req.params;
  getProductsFromID(id)
    .then((products) => {
      return res.status(200).json({ success: true, data: products });
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(404);
    });
};
const getProductsByCategory = (req, res) => {
  const { category } = req.params;
  getProductsFromCategory(category)
    .then((products) => {
      return res.status(200).json({ success: true, data: products });
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(404);
    });
};
const getProducts = (req, res) => {
  getAllProducts()
    .then((products) => {
      return res.status(200).json({ success: true, data: products });
    })
    .catch((err) => {
      console.log(err);
      return res.sendStatus(404);
    });
  // return res.status(200).json({ success: true, data: ProductsData });
};
const createProduct = (req, res) => {
  const { name, category, description, price, rating } = req.body;
  if (name && category && description && price && rating) {
    createNewProduct({ name, category, description, price, rating })
      .then((product) => {
        return res.status(201).json({ success: true, data: product });
      })
      .catch((err) => console.log(err));
  } else {
    res.status(400).json({
      success: false,
      data: [],
      msg: "Please Enter Valid Information",
    });
  }
};
const updateProduct = (req, res) => {
  const { _id, name, category, description, price, rating } = req.body;
  if (_id && name && description && category && price && rating) {
    findAndUpdateProduct({ _id, name, category, description, price, rating })
      .then((product) => {
        if (!product) {
          return res
            .status(404)
            .send({ success: false, data: [], msg: "Product not Found" });
        } else {
          return res.status(200).send({ success: true, data: product });
        }
      })
      .catch((err) => console.log(err));
  } else {
    res
      .status(400)
      .json({ success: false, data: [], msg: "Please Enter all Information" });
  }
};
const deleteProduct = (req, res) => {
  const { _id } = req.body;
  if (_id) {
    findAndDeleteProduct({ _id })
      .then((product) => {
        if (!product) {
          return res
            .status(404)
            .json({ sucess: false, data: [], msg: "Product Not Found" });
        } else {
          return res.status(200).json({ success: true, data: product });
        }
      })
      .catch((err) => console.log(err));
  } else {
    res
      .status(400)
      .json({ success: false, data: [], msg: "Please Enter all Information" });
  }
};
module.exports = {
  getProductsByID,
  getProductsByCategory,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
