const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const adminMiddleWare = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null; // Lấy phần token

    if (!token) {
        return res.status(401).json({
            message: 'Authentication token missing',
            status: 'ERROR'
        });
    }

    jwt.verify(token, process.env.ACCESS_TOKEN, function (err, user) {
        if (err) {
            console.log(err);
            return res.status(403).json({
                message: 'Authentication failed',
                status: 'ERROR'
            });
        }
        
        console.log(user)
        if (user?.isAdmin) {
            next();
        } else {
            return res.status(403).json({
                message: 'Access denied: Admins only',
                status: 'ERROR'
            });
        }
    });
}


const authUserMiddleWare = (req, res, next)=>{
    const authHeader = req.headers['authorization'];
    const token = authHeader ? authHeader.split(' ')[1] : null; 
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
        if (user?.id === userId || user?.isAdmin ) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    })
}

const productAgentMiddleWare = (req, res, next)=>{
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

    console.log(process.env.ACCESS_TOKEN) 
    jwt.verify(token, process.env.ACCESS_TOKEN , function (err, decode){
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        console.log(decode)
        if (decode?.role?.includes('Quản lý sản phẩm') || decode?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    })
}

const customerAgentMiddleWare = (req, res, next)=>{
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

    console.log(process.env.ACCESS_TOKEN) 
    jwt.verify(token, process.env.ACCESS_TOKEN , function (err, decode){
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        console.log(decode)
        if (decode?.role?.includes('Quản lý khách hàng') || decode?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    })
}

const orderAgentMiddleWare = (req, res, next)=>{
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

    console.log(process.env.ACCESS_TOKEN) 
    jwt.verify(token, process.env.ACCESS_TOKEN , function (err, decode){
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        console.log(decode)
        if (decode?.role?.includes('Quản lý đơn hàng') || decode?.isAdmin) {
            next()
        } else {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
    })
}

const feedbackAgentMiddleWare = (req, res, next)=>{
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

    console.log(process.env.ACCESS_TOKEN) 
    jwt.verify(token, process.env.ACCESS_TOKEN , function (err, decode){
        if (err) {
            return res.status(404).json({
                message: 'The authemtication',
                status: 'ERROR'
            })
        }
        console.log(decode)
        if (decode?.role?.includes('Quản lý khách hàng') || decode?.isAdmin) {
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
    adminMiddleWare,
    authUserMiddleWare,
    productAgentMiddleWare,
    customerAgentMiddleWare,
    orderAgentMiddleWare,
    feedbackAgentMiddleWare
}