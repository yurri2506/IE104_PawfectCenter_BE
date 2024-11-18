const staffService = require('../services/Staff.service')

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

        const response = await staffService.changePassword(req.body, id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            status: 'ERROR',
            message: error.message
        })
    }
}

const updateStaff = async(req, res)=>{
    const {name, email, phone} = req.body
    const id =  req.params.id
    try {

        const response = await staffService.updateStaff(req.body, id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            status: 'ERROR',
            message: error.message
        })
    }
}


const deleteStaff = async(req, res)=>{
    const id =  req.params.id
    try {

        const response = await staffService.deleteStaff(id)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            status: 'ERROR',
            message: error.message
        })
    }
}

module.exports = {
    changePassword,
    updateStaff,
    deleteStaff
}