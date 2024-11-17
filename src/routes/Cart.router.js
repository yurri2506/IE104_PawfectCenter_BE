const express = require("express");
const router = express.Router()
const CartController = require('../controllers/Cart.controller');

router.post('/create', CartController.createCart);
router.patch('/update/:id', CartController.updateCart);
router.get('/get-details/:id', CartController.getDetailsCart);

module.exports = router