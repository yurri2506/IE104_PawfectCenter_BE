const notificationService = require("../services/Notification.service")

const getAllNotify =  async(req, res) =>{
    try {
        const userId = req.params.id

        if(!userId){
            return res.status(400).json({
                status: 'ERROR',
                message: 'user id la bat buoc'
            })
        }

        const response = await notificationService.getAllNotify(userId)
        console.log(response)
        return res.status(200).json(response)
    } catch (error) {
        return res.status(500).json({
            status: 'ERROR',
            message: error.message
        })
    }
}


module.exports = {
    getAllNotify
}