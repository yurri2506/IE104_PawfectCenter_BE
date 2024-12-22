const express = require('express')
const router = express.Router()
const staffController = require("../controllers/Staff.controller")
const {adminMiddleWare, authUserMiddleWare} = require('../middleware/AuthMiddleWare')

router.put('/change-password/:id', authUserMiddleWare, staffController.changePassword)
router.put('/update-staff/:id', authUserMiddleWare, staffController.updateStaff)
router.post('/delete-staff/:id', authUserMiddleWare, staffController.deleteStaff)

module.exports = router