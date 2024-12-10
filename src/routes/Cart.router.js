const express = require("express");
const router = express.Router()
const CartController = require('../controllers/Cart.controller');
const { authUserMiddleWare } = require("../middleware/AuthMiddleWare");

router.post('/create', CartController.createCart);
router.patch('/update/:id', CartController.updateCart);
router.patch('/update2/:id', CartController.updateCart2);
router.get('/get-all-product/:id', authUserMiddleWare, CartController.getAllProductByUserId);
router.get('/:userId/search', CartController.searchProductsInCart);
router.delete('/delete/:id', authUserMiddleWare, CartController.deleteProductCart);

module.exports = router