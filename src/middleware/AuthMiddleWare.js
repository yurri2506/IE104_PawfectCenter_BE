const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const authUserMiddleWare = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null; // Lấy phần token
    //const token = req.headers.token.split(' ')[1]
    console.log(token)
    
    if (!token) {
        return res.status(401).json({
            message: 'Token is required',
            status: 'ERROR'
        });
    }

    const userId = req.params.id
    console.log(process.env.ACCESS_TOKEN)
    jwt.verify(token, process.env.ACCESS_TOKEN , function (err, user){
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        console.log(user)
        if (user.payload?.id === userId) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    })
}

module.exports={
    authUserMiddleWare
}