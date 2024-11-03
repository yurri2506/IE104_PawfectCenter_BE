const express = require('express')
const router = express.Router()
const userController = require("../controllers/User.controller")
const otpController = require("../controllers/Otp.controller")
const {authUserMiddleWare} = require('../middleware/AuthMiddleWare')

router.post('/send-otp' ,  otpController.sendOtp)   
router.post('/verify-otp' ,  otpController.verifyOtp) 
router.post('/signUpPhone', userController.signUpPhone)
router.post('/signUpEmail', userController.signUpEmail)
router.post('/signIn', userController.signIn)
router.get('/getUser/:id', authUserMiddleWare, userController.getDetailUser)

module.exports = router