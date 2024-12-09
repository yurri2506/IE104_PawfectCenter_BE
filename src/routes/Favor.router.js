const express = require("express");
const router = express.Router()
const FavorController = require('../controllers/Favor.controller');
const {authUserMiddleWare} = require('../middleware/AuthMiddleWare')

router.post('/create', FavorController.createFavor);
router.patch('/update/:id', FavorController.updateFavor);
router.get('/get-details/:id', authUserMiddleWare, FavorController.getDetailsFavor);

module.exports = router