const User = require('../models/User.model')
const Cart = require('../models/Cart.model')
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
                    user_password: hash,
                    user_avt_img: "",
                    user_address: []
                })
            
                console.log(createUser)
                if(createUser){
                    await Cart.create({
                    user_id: createUser._id
                })
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
    // return new Promise(async (resolve, reject) => {
    //     const { email, phone, password } = signInUser;
    //     console.log(signInUser)
    //     try {
    //         let checkUser;

    //         if (email) {
    //             checkUser = await User.findOne({ user_email: email });
    //         }

    //         if (!checkUser && phone) {
    //             checkUser = await User.findOne({ user_phone: phone });
    //         }
    //         console.log(checkUser)

    //         if (!checkUser || checkUser.is_delete) {
    //             return reject({
    //                 status: 'ERROR',
    //                 field: 'email_or_phone',
    //                 message: 'Tài khoản chưa được đăng ký'
    //             });
    //         }

    //         const isPasswordCorrect = await bcrypt.compare(password, checkUser.user_password);
    //         if (!isPasswordCorrect) {
    //             return reject({
    //                 status: 'ERROR',
    //                 field: 'isTruePass',
    //                 message: 'Mật khẩu không chính xác'
    //             });
    //         }

    //         const access_token = await genneralAccessToken({
    //             id: checkUser.id
    //         })
    //         const refresh_token = await genneralRefreshToken({
    //             id: checkUser.id
    //         })

    //         return resolve({
    //             status: 'OK',
    //             message: 'Đăng nhập thành công',
    //             ACCESS_TOKEN: access_token,
    //             REFRESH_TOKEN: refresh_token
    //         });
    //     } catch (err) {
    //         reject({
    //             status: 'ERROR',
    //             message: 'Lỗi xảy ra khi đăng nhập',
    //             error: err.message  // chỉ gửi chi tiết lỗi khi có lỗi hệ thống
    //         });
    //     }
    // });

    return new Promise(async (resolve, reject) => {
        const { identifier, password } = signInUser;
        console.log(signInUser)
        try {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            let checkUser;
            if (emailRegex.test(identifier)) {
                console.log(emailRegex.test(identifier))
                checkUser = await User.findOne({ user_email: identifier });
            } else if (/^\d+$/.test(identifier)) {
                console.log(/^\d+$/.test(identifier))
                checkUser = await User.findOne({ user_phone: identifier });
            }

            if (!checkUser || checkUser.is_delete) {
                return reject({
                    statusCode: 400,
                    field: 'email_or_phone',
                    message: 'Tài khoản chưa được đăng ký'
                });
            }

            const isPasswordCorrect = await bcrypt.compare(password, checkUser.user_password);
            if (!isPasswordCorrect) {
                return reject({
                    statusCode: 400,
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
                statusCode: 500,
                message: 'Lỗi xảy ra khi đăng nhập',
                error: err.message  // chỉ gửi chi tiết lỗi khi có lỗi hệ thống
            });
        }
    });
};

const getDetailUser = (userId)=>{
    return new Promise( async(resolve, reject)=>{
        const user = await User.findById(userId)
        try{
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
        const {name, email, phone, sex, birth} = userEdited
        try{
            const user = await User.findById(userId)
            if(!user){
                return reject({
                    status: "ERROR",
                    message: "Tai khoan khong ton tai"
                })
            }else{
                const editUser = await User.findByIdAndUpdate(
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
                    data: editUser
                })
            }        
        }catch(err){
            reject(err)
        }
    })
}

const changePassword = (data, userId) =>{
    return new Promise (async(resolve, reject) => {
        const {password, newPassword, confirmNewPass} = data
        try{
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
                const editUser = await
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
                    data: editUser
                })
            }        

        }catch(err){
            reject(err)
        }
    })
}

const forgetPassword = (data) =>{
    return new Promise(async(resolve, reject) =>{
        const{email, phone, newPassword, confirmNewPass} = data
        try {
            let user
            if(email && !phone){
                user = await User.findOne({
                    user_email: email
                })
            }
            if(!email && phone){
                user = await User.findOne({
                    user_phone: phone
                })
            }

            if(!user){
                return reject({
                    status: 'ERROR',
                    message: 'Tai khoan nay chua duoc dang ky'
                })
            }

            const hash = bcrypt.hashSync(newPassword, 10)
            const editUser = await User.findByIdAndUpdate(
                user._id,
                {
                    user_password: hash
                },
                {new: true}
            )

            return resolve({
                status: 'Successfully',
                message: 'Dat lai mat khau thanh cong',
                data: editUser
            })
        } catch (err) {
            return reject({
                status: 'ERROR',
                message: err.message
            })
        }
    })
}

const deleteUser = (userId) =>{
    return new Promise( async(resolve, reject) =>{
        try {
            const user = await User.findById(userId)
            if(!user){
                return reject({
                    status: 'ERROR',
                    message: 'Tai khoan nay khong ton tai'
                })
            }

            const userDelete = await User.findByIdAndUpdate(
                userId,
                {
                    is_delete: true
                },
                {new: true}
            )

            return resolve({
                status: 'Successfully',
                message: 'Xoa tai khoan nguoi dung thanh cong',
                data: userDelete
            })
        } catch (err) {
            return reject(e)
        }
    })
}

const addAddress = (userId, newAddress) =>{
    return new Promise (async( resolve, reject) =>{
        try {
            const user = await User.findById(userId)
            if(!user){
                return reject({
                    status: 'ERROR',
                    message: 'Tai khoan nay khong ton tai'
                })
            }

            if (newAddress.isDefault) {
                await User.updateOne(
                    { _id: userId, "user_address.isDefault": true },
                    { $set: { "user_address.$.isDefault": false } }
                );
            }
            const userAddAdress = await User.findByIdAndUpdate(
                userId,
                {
                    $push: { user_address: newAddress } 
                },
                {new: true}
            )

            return resolve({
                status: 'Successfully',
                message: 'Them dia chi moi thanh cong',
                data: userAddAdress
            })

        } catch (err) {
            return reject(err)
        }
    })
}

const setAddressDefault = (userId, addressId)=>{
    return new Promise (async(resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: userId,
                "user_address._id" : addressId
            })
            if(!user){
                return reject({
                    status: 'ERROR',
                    message: 'Tai khoan nay khong ton tai hoac dia chi khong ton tai'
                })
            }

            await User.updateOne(
                {_id: userId, "user_address.isDefault": true},
                { $set: { "user_address.$.isDefault": false } }
            )

            const updateAddressUser = await User.updateOne(
                { _id: userId, "user_address._id": addressId },
                { $set: { "user_address.$.isDefault": true } }
            )

            return resolve({
                status: "successfully",
                message: 'Dat dia chi mac dinh thanh cong',
                data: updateAddressUser
            })
        } catch (err) {
            return reject(err)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find().sort({createdAt: -1, updatedAt: -1})
            return resolve({
                status: 'OK',
                message: 'Success',
                data: allUser
            })
        } catch (e) {
            return reject(e)
        }
    })
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
    setAddressDefault,
    getAllUser
}