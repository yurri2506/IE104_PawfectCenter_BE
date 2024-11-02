const express = require("express");
const router = express.Router()
const ProductController = require('../controllers/Product.controller');

router.post('/create', ProductController.createProduct)

module.exports = router