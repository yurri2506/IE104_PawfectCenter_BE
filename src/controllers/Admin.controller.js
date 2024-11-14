
const adminService = require('../services/Admin.service')


const signIn = async(req, res) => {
    const {signInName, password} = req.body
    try {
        if(!signInName || !password){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Ten dang nhap va mat khau la bat buoc'
            })
        }

        const response = await adminService.signIn(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            status: 'ERROR',
            message: error.message
        })
    }
}

const createAdmin = async(req, res) => {
    const {name, email, password, confirmPassword} = req.body
    try {
        if(!name || !email || !password || !confirmPassword){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Thong tin la bat buoc'
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Mat khau xac nhan khong khop'
            })
        }

        const response = await adminService.createAdmin(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            status: 'ERROR',
            message: error.message
        })
    }
}

const createStaff = async(req, res) => {
    const {name, email, phone, password, confirmPassword, role} = req.body
    try {
        if(!name || !email || !phone || !password || !confirmPassword || !role){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Thong tin la bat buoc'
            })
        }

        if(password !== confirmPassword){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Mat khau xac nhan khong khop'
            })
        }

        const response = await adminService.createStaff(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            status: 'ERROR',
            message: error.message
        })
    }
}


const forgetPassword = async(req, res)=>{
    const {email, newPassword, confirmNewPass} = req.body
    try {
        if(!email || !newPassword, !confirmNewPass){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Cac thong tin la bat buoc'
            })
        } 

        const response = await adminService.forgetPassword(req.body)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            status: 'ERROR',
            message: error.message
        })
    }
}

const changePassword = async(req, res)=>{
    const {password, newPassword, confirmNewPass} = req.body
    const id =  req.params.id
    try {
        if(!password || !newPassword, !confirmNewPass){
            return res.status(400).json({
                status: 'ERROR',
                message: 'Cac thong tin la bat buoc'
            })
        } 

        const response = await adminService.changePassword(req.body, id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            status: 'ERROR',
            message: error.message
        })
    }
}

const updateAdmin = async(req, res)=>{
    const id =  req.params.id
    try {
        
        const response = await adminService.updateAdmin(req.body, id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            status: 'ERROR',
            message: error.message
        })
    }
}

module.exports = {
    signIn,
    createAdmin,
    createStaff,
    forgetPassword,
    changePassword,
    updateAdmin
}