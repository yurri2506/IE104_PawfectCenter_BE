const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config()

const genneralAccessToken = async(payload) =>{
    const accessToken = jwt.sign(
        payload
    , process.env.ACCESS_TOKEN, {expiresIn: '1h'})
    return accessToken
}

const genneralRefreshToken = async(payload) =>{
    const refreshToken = jwt.sign(
        payload
    , process.env.REFRESH_TOKEN, {expiresIn: '365d'})
    return refreshToken
}

const refreshTokenService = async(refresh_token) =>{

    return new Promise(async(resolve, reject) => {
        try{
            console.log(refresh_token)
            jwt.verify(refresh_token, process.env.REFRESH_TOKEN, async(err, user)=>{
                if(err){
                    reject({
                        status: 'ERROR',
                        message: 'The authentication'
                    })
                }
                console.log(user)

                const access_token = await genneralAccessToken({
                    id: user?.id 
                })

                resolve({
                    status: 'OK',
                    message: 'successfully',
                    ACCESS_TOKEN: access_token
                })

            })
        }catch(error){
            reject(error)
        }
    })
}

module.exports = {
    genneralAccessToken,
    genneralRefreshToken,
    refreshTokenService
}