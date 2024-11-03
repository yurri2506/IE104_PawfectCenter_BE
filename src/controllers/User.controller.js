const userService = require("../services/User.service")
const {userSignUpPhone, userSignUpEmail} = require('../validations/UserSignUp.validation')

const signUpPhone = async(req, res)=>{
    try{
        console.log(req.body)

        const {error} = userSignUpPhone.validate(req.body, {abortEarly: false})

        if(error){
            return res.status(400).json({
                status: 'ERROR',
                errors: error.details.reduce((acc, detail) =>{
                    acc[detail.context.key] = detail.message
                    return acc
                }, {})
            })
        }

        const response = await userService.signUpPhone(req.body)

        return res.status(200).json(response)
    }catch(err){
        return res.status(500).json({
            message: err
        })
    }
}

const signUpEmail = async(req, res)=>{
    try{
        console.log(req.body)

        const {error} = userSignUpEmail.validate(req.body, {abortEarly: false})

        if(error){
            return res.status(400).json({
                status: 'ERROR',
                errors: error.details.reduce((acc, detail) =>{
                    acc[detail.context.key] = detail.message
                    return acc
                }, {})
            })
        }

        const response = await userService.signUpEmail(req.body)

        return res.status(200).json(response)
    }catch(err){
        return res.status(500).json({
            message: err
        })
    }
}

const signIn = async(req, res) =>{
    try{
        const{email, phone, password} = req.body

        if(!email && !phone){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Bat buoc nhap Email hoac phone'
            })
        }

        if(email && !phone){
            const reg = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/
            const isCheckEmail = reg.test(email)
            if (!isCheckEmail) {
                return res.status(400).json({
                    status: 'ERROR',
                    message: 'Email khong hop le'
                })
            } 
        }

        if (phone && !email) {
            const reg = /^(0[1-9][0-9]{8}|[1-9][0-9]{9})$/; 
            const isCheckPhone = reg.test(phone);
        
            if (!isCheckPhone) {
                return res.status(400).json({
                    status: 'ERROR',
                    message: 'So dien thoai khong hop le'
                })
            } 
        }

        if(!password){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Mat khau la bat buoc'
            })
        }

        const response = await userService.signIn(req.body)

        return res.status(200).json(response)
    }catch(err){
        return res.status(404).json({
            message: err
        })
    }

}

const getDetailUser = async(req, res) =>{
    try{
        const userId = req.params.id
        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }
        const response = await userService.getDetailUser(userId)

        return res.status(200).json(response)
    }catch(err){
        return res.status(404).json({
            message: err
        })
    }
}

module.exports = {
    signUpPhone,
    signUpEmail,
    signIn,
    getDetailUser
}