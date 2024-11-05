const express = require("express");
const router = express.Router()
const CategoryController = require('../controllers/Category.controller');

router.post('/create', CategoryController.createCategory);
router.patch('/update/:id', CategoryController.updateCategory);
router.delete('/delete/:id', CategoryController.deleteCategory);
router.get('/get-type-category', CategoryController.getTypeCategory);

module.exports = router