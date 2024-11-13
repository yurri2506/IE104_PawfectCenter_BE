const express = require('express')
const router = express.Router()
const adminController = require("../controllers/Admin.controller")
const otpController = require("../controllers/Otp.controller")
const {adminMiddleWare, authUserMiddleWare} = require('../middleware/AuthMiddleWare')

router.post('/send-otp' ,  otpController.sendOtp)   
router.post('/verify-otp' ,  otpController.verifyOtp) 
router.post('/sign-in', adminController.signIn)
router.post('/create-staff', adminMiddleWare, adminController.createStaff)
router.post('/create-admin', adminMiddleWare, adminController.createAdmin)
router.post('/forget-password', adminController.forgetPassword)
router.put('/change-password/:id', authUserMiddleWare, adminController.changePassword)

module.exports = router