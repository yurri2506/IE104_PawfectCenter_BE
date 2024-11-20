const { response } = require("express")
const userService = require("../services/User.service")
const { changePasswordSchema } = require("../validations/ChangePassword.validate")
const {userSignUpPhone, userSignUpEmail} = require('../validations/UserSignUp.validation')
const JwtService = require('../services/Jwt.service')

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
    // try{
    //     const { email, phone, password } = req.body;
    //     const errors = {};

    //     if (!email && !phone) {
    //         errors.general = 'Bắt buộc nhập Email hoặc Số điện thoại';
    //     }

    //     if (email && !phone) {
    //         const emailRegEx = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    //         if (!emailRegEx.test(email)) {
    //             errors.email = 'Email không hợp lệ';
    //         }
    //     }

    //     if (phone && !email) {
    //         const phoneRegEx = /^(0[1-9][0-9]{8}|[1-9][0-9]{9})$/;
    //         if (!phoneRegEx.test(phone)) {
    //             errors.phone = 'Số điện thoại không hợp lệ';
    //         }
    //     }

    //     if (!password) {
    //         errors.password = 'Mật khẩu là bắt buộc';
    //     }

    //     // Kiểm tra nếu có bất kỳ lỗi nào thì trả về lỗi
    //     if (Object.keys(errors).length > 0) {
    //         return res.status(400).json({
    //             status: 'ERROR',
    //             errors: errors
    //         });
    //     }

    //     // Nếu không có lỗi, tiếp tục xử lý đăng nhập
    //     const response = await userService.signIn(req.body);
    //     return res.status(200).json(response);

    // }catch(err){
    //     return res.status(404).json({
    //         message: err
    //     })
    // }
    try{

        const { identifier, password } = req.body;
        
        if(!identifier){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Thong tin la bat buoc'
            })
        }

        if (!password) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Mat khau la bat buoc'
            })
        }

        const response = await userService.signIn(req.body);
        return res.status(200).json(response);

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

const editUser = async(req, res) =>{
    try{
        const userId = req.params.id

        if(!userId){
            return res.status(200).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }

        const response = await userService.editUser(req.body, userId)
        return res.status(200).json(response)
    }catch(err){
        return res.status(500).json({
            message: err
        })
    }
}

const changePassword = async(req, res) => {
    try{
        const {error} = changePasswordSchema.validate(req.body, {abortEarly: false})
        const userId = req.params.id

        if(!userId){
            return res.status(400).json({
                status: 'ERR',
                message: 'The userId is required'
            })
        }

        if(error){
            return res.status(400).json({
                status: 'ERROR',
                errors: error.details.reduce((acc, detail) =>{
                    acc[detail.context.key] = detail.message
                    return acc
                }, {})
            })
        }

        const response = await userService.changePassword(req.body, userId)

        return res.status(200).json(response)
        
    }catch(err){
        console.error(err)
        return res.status(500).json({
            message: err
        })
    }
}

const forgetPassword = async(req, res) => {
    try {
        const {email, phone, newPassword, confirmNewPass} = req.body

        if(!email && !phone){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Bat buoc nhap email hoac Sdt'
            })
        }
        if(newPassword !== confirmNewPass){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Mat khau xac nhan khong trung voi mat khau moi'
            })
        }

        const response = await userService.forgetPassword(req.body)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({
            message: 'Loi khi dat lai mat khau moi'
        })
    }
}

const deleteUser = async(req, res) =>{
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Id la bat buoc'
            })
        }

        const response = await userService.deleteUser(userId)
        return res.status(200).json(response)
    } catch (err) {
        return res.status(500).json({
            message: 'Loi khi xoa tai khoan'
        })
    }
}

const addAddress = async(req, res) =>{
    try {
        const userId = req.params.id
        if(!userId){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Id la bat buoc'
            })
        }

        const {home_address, province, district, commune , isDefault} = req.body

        if(!home_address|| !province || !district || !commune){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Cac truong dia chi la bat buoc'
            })
        }

        const response = await userService.addAddress(userId, req.body)
        return res.status(200).json(response)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Loi khi them dia chi'
        })
    }
}

const setAddressDefault = async(req, res)=>{
    try {
        const userId = req.params.id
        const addressId = req.params.address_id
        if(!userId || !addressId){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Cac truong userId, addressId la bat buoc'
            })
        }

        const response = await userService.setAddressDefault(userId, addressId)
        return res.status(200).json(response)
    } catch (err) {
        console.log(err)
        return res.status(500).json({
            message: 'Loi khi them dia chi'
        })
    }
}

const signOut = async (req, res) => {
    try {
        res.clearCookie('refresh_token')
        return res.status(200).json({
            status: 'OK',
            message: 'Logout successfully'
        })
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

const refreshToken = async (req, res) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader ? authHeader.split(' ')[1] : null; // Lấy phần token
        if (!token) {
            return res.status(200).json({
                status: 'ERR',
                message: 'The token is required'
            })
        }
        const response = await JwtService.refreshTokenService(token)
        return res.status(200).json(response)
    } catch (e) {
        console.log(e)
        return res.status(404).json({
            message: e
        })
    }
}

module.exports = {
    signUpPhone,
    signUpEmail,
    signIn,
    getDetailUser,
    editUser,
    changePassword,
    forgetPassword,
    deleteUser,
    addAddress,
    signOut,
    setAddressDefault,
    refreshToken
}