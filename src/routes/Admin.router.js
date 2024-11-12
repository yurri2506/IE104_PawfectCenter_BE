const express = require('express')
const router = express.Router()
const adminController = require("../controllers/Admin.controller")
const otpController = require("../controllers/Otp.controller")
//const {authUserMiddleWare} = require('../middleware/AuthMiddleWare')

router.post('/send-otp' ,  otpController.sendOtp)   
router.post('/verify-otp' ,  otpController.verifyOtp) 
router.post('/sign-in', adminController.signIn)
router.post('/create-staff', adminController.createStaff)
router.post('/create-admin', adminController.createAdmin)


module.exports = router