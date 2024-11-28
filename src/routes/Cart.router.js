const express = require("express");
const router = express.Router()
const CartController = require('../controllers/Cart.controller');
const { authUserMiddleWare } = require("../middleware/AuthMiddleWare");

router.post('/create', CartController.createCart);
router.patch('/update/:id', CartController.updateCart);
router.get('/get-all-product/:id', authUserMiddleWare, CartController.getAllProductByUserId);
router.get('/cart/:userId/search', CartController.searchProductsInCart);

module.exports = router