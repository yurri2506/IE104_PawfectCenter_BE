const express = require("express");
const router = express.Router()
const CartController = require('../controllers/Cart.controller');

router.post('/create', CartController.createCart);
router.patch('/update/:id', CartController.updateCart);

module.exports = router