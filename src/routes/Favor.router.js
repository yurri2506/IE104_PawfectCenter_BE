const express = require("express");
const router = express.Router()
const FavorController = require('../controllers/Favor.controller');

router.post('/create', FavorController.createFavor);
router.patch('/update/:id', FavorController.updateFavor);
router.get('/get-details/:id', FavorController.getDetailsFavor);

module.exports = router