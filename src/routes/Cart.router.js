const express = require("express");
const router = express.Router()
const CartController = require('../controllers/Cart.controller');

router.post('/create', CartController.createCart);
router.patch('/update/:id', CartController.updateCart);
router.get('/:userId/get-all-product', CartController.getAllProductByUserId);
router.get('/cart/:userId/search', CartController.searchProductsInCart);

module.exports = router