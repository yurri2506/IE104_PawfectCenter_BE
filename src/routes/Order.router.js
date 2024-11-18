const express = require("express");
const router = express.Router();
const OrderController = require('../controllers/Order.controller');

router.post('/create', OrderController.createOrder);
router.post('/preview', OrderController.previewOrder);
router.patch('/update/:id', OrderController.updateOrder);
router.get('/details/:id', OrderController.getOrderDetails);
// router.delete('/delete/:id', OrderController.deleteOrder);
router.get('/filter-status', OrderController.getOrdersByStatus); // có thể truyền vào status và userId

module.exports = router;