const express = require('express');
const router = express.Router();
const {
  getProductsByCategory,
  getProductsByID,
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/products');

router
  .route('/')
  .get(getProducts)
  .post(createProduct)
  .delete(deleteProduct)
  .put(updateProduct);

router.route('/product/:id').get(getProductsByID);
router.route('/:category').get(getProductsByCategory);

module.exports = router;
