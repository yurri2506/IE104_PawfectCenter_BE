const express = require("express");
const router = express.Router()
const StoreController = require('../controllers/Store.controller');

router.post("/create", StoreController.uploadFields, StoreController.createStore);
router.patch('/update/:id', StoreController.updateStore);
router.get('/get-detail', StoreController.getDetail);

module.exports = router