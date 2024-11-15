const express = require("express");
const router = express.Router()
const DiscountController = require('../controllers/Discount.controller');

router.post('/create', DiscountController.createDiscount);
router.patch('/update/:id', DiscountController.updateDiscount);
router.delete('/delete/:id', DiscountController.deleteDiscount);
router.get('/get-details/:id', DiscountController.getDiscountDetails);

module.exports = router