const express = require("express");
const router = express.Router()
const OrderController = require('../controllers/Order.controller');

router.post('/create', OrderController.createOrder);
// router.patch('/update/:id', OrderController.updateCategory);
// router.delete('/delete/:id', OrderController.deleteCategory);
// router.get('/get-type-category', CategoryController.getTypeCategory);

module.exports = router