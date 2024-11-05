const User = require('../models/User.model')
const bcrypt = require('bcrypt')
const {genneralAccessToken, genneralRefreshToken}= require('./Jwt.service')
const { messaging } = require('firebase-admin')

const signUpPhone = (newUser)=>{
    return new Promise( async(resolve, reject)=>{
        const{phone, name, password, confirmPassword} = newUser
        try{
            const checkUser = await User.findOne({
                user_phone: phone
            })

            if(checkUser !== null){
                reject({
                    status: 'ERROR',
                    message: 'So dien thoai da ton tai'
                })
            }else{
                const hash = await bcrypt.hash(password, 10);
                const createUser = await User.create({
                    user_phone: phone,
                    user_name: name,
                    user_password: hash
                })
                console.log(createUser)
                if(createUser){
                    resolve({
                        status: 'OK',
                        message: 'Dang ky thanh cong',
                        data: createUser
                    })
                }
            }
            
        }catch(err){
            reject({
                status: 'ERROR',
                message: 'Loi khi dang ky nguoi dung',
                error: err.message
            })
        }
    })
}

const signUpEmail = (newUser)=>{
    return new Promise( async(resolve, reject)=>{
        const{email, name, password, confirmPassword} = newUser
        try{
            const checkUser = await User.findOne({
                user_email: email
            })

            if(checkUser !== null){
                reject({
                    status: 'ERROR',
                    message: 'Email da ton tai'
                })
            }else{
                const hash = await bcrypt.hash(password, 10);
                const createUser = await User.create({
                    user_email: email,
                    user_name: name,
                    user_password: hash
                })
                console.log(createUser)
                if(createUser){
                    resolve({
                        status: 'OK',
                        message: 'Dang ky thanh cong',
                        data: createUser
                })
                }
            }
            
        }catch(err){
            reject({
                status: 'ERROR',
                message: 'Loi khi dang ky nguoi dung',
                error: err.message
            })
        }
    })
}


const signIn = (signInUser) => {
    return new Promise(async (resolve, reject) => {
        const { email, phone, password } = signInUser;
        console.log(signInUser)
        try {
            let checkUser;

            if (email) {
                checkUser = await User.findOne({ user_email: email });
            }

            if (!checkUser && phone) {
                checkUser = await User.findOne({ user_phone: phone });
            }
            console.log(checkUser)

            if (!checkUser) {
                return reject({
                    status: 'ERROR',
                    field: 'email_or_phone',
                    message: 'Tài khoản chưa được đăng ký'
                });
            }

            const isPasswordCorrect = await bcrypt.compare(password, checkUser.user_password);
            if (!isPasswordCorrect) {
                return reject({
                    status: 'ERROR',
                    field: 'isTruePass',
                    message: 'Mật khẩu không chính xác'
                });
            }

            const access_token = await genneralAccessToken({
                id: checkUser.id
            })
            const refresh_token = await genneralRefreshToken({
                id: checkUser.id
            })

            return resolve({
                status: 'OK',
                message: 'Đăng nhập thành công',
                ACCESS_TOKEN: access_token,
                REFRESH_TOKEN: refresh_token
            });
        } catch (err) {
            reject({
                status: 'ERROR',
                message: 'Lỗi xảy ra khi đăng nhập',
                error: err.message  // chỉ gửi chi tiết lỗi khi có lỗi hệ thống
            });
        }
    });
};

const getDetailUser = (userId)=>{
    return new Promise( async(resolve, reject)=>{
        try{
            const user = await User.findById(userId)

            if(user === null){
                return reject({
                    status: 'ERROR',
                    message: 'Nguoi dung khong ton tai'
                })
            }else{
                return resolve({
                    status: 'OK',
                    message: 'Thanh cong',
                    data: user
                })
            }
        }catch(err){
            reject(err)
        }
    })
  }

const editUser = (userEdited, userId) =>{
    return new Promise (async(resolve, reject) =>{
        try{
            const user = await User.findById(userId)
            const {name, email, phone, sex, birth} = userEdited
            if(!user){
                return reject({
                    status: "ERROR",
                    message: "Tai khoan khong ton tai"
                })
            }else{
                const EditUser = await User.findByIdAndUpdate(
                    userId,
                    {
                        user_name: name,
                        user_email: email,
                        user_phone: phone,
                        user_sex: sex,
                        user_birth: birth
                    },
                    { new: true } // Tùy chọn trả về tài liệu sau khi cập nhật
                );
                return resolve({
                    status: 'OK',
                    message: 'Chinh sua thanh cong',
                    data: EditUser
                })
            }        
        }catch(err){
            reject(err)
        }
    })
}

const changePassword = (data, userId) =>{
    return new Promise (async(resolve, reject) => {
        try{
            const {password, newPassword, confirmNewPass} = data
            const user = await User.findById(userId)

            if(!user){
                return reject({
                    status: "ERROR",
                    message: "Tai khoan khong ton tai"
                })
            }else{
                const isPasswordCorrect = await bcrypt.compare(password, user.user_password);
                if (!isPasswordCorrect) {
                    return reject({
                        status: 'ERROR',
                        message: 'Mật khẩu không chính xác'
                    });
                }

                const hash = bcrypt.hashSync(newPassword, 10)
                const EditUser = await
                User.findByIdAndUpdate(
                    userId,
                    {
                        user_password: hash
                    },
                    { new: true } // Tùy chọn trả về tài liệu sau khi cập nhật
                );
                return resolve({
                    status: 'OK',
                    message: 'Doi mat khau thanh cong',
                    data: EditUser
                })
            }        

        }catch(err){
            reject(err)
        }
    })
}
module.exports = {
    signUpPhone,
    signUpEmail,
    signIn,
    getDetailUser,
    editUser,
    changePassword
}