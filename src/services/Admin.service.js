const Admin = require('../models/Admin.model')
const Staff = require('../models/Staff.model')
const bcrypt = require('bcrypt')
const {genneralAccessToken, genneralRefreshToken}= require('./Jwt.service')



const signIn = (signInData) =>{
    return new Promise( async(resolve, reject) => {
        const {signInName, password} = signInData
        try {
            const admin = await Admin.findOne({admin_name: signInName})
            const staff = await Staff.findOne({staff_name: signInName})

            if(!admin && !staff){
                return reject({
                    status: 'ERROR',
                    message: 'Khong ton tai nguoi dung'
                })
            }
            let access_token, refresh_token
            if(admin){
                const checkPassword = await bcrypt.compare(password, admin.admin_password)
                if(!checkPassword){
                    return reject({
                        status: 'ERROR',
                        message: 'Mat khau khong chinh xac',
                    })
                }

                    access_token = await genneralAccessToken({
                    id: admin._id,
                    role: admin.role
                })
                    refresh_token = await genneralRefreshToken({
                    id: admin._id,
                    role: admin.role
                })
            }

            if(staff){
                const checkPassword = await bcrypt.compare(password, staff.staff_password)
                if(!checkPassword){
                    return reject({
                        status: 'ERROR',
                        message: 'Mat khau khong chinh xac',
                    })
                }

                    access_token = await genneralAccessToken({
                    id: staff._id,
                    role: staff.staff_role
                })
                    refresh_token = await genneralRefreshToken({
                    id: staff._id,
                    role: staff.staff_role
                })
            }

            return resolve({
                status: 'OK',
                message: 'Đăng nhập thành công',
                ACCESS_TOKEN: access_token,
                REFRESH_TOKEN: refresh_token
            });
        } catch (error) {
            return reject(error)
        }
    })
}

const createAdmin = (newAdmin) =>{
    return new Promise(async(resolve, reject) => {
        const {name, email, password, confirmPassword} = newAdmin
        try {
            const checkAdmin = await Admin.findOne({
                admin_name: name, 
                admin_email: email
            })
            if(checkAdmin){
                return reject({
                    status: 'ERROR',
                    message: 'Tai khoan Admin da ton tai'
                })
            }

            const hash = await bcrypt.hash(password, 10)
            const admin = await Admin.create({
                admin_name: name,
                admin_email: email,
                admin_password: hash
            })

            console.log(admin)
            return resolve({
                status: 'OK',
                message: 'Tao tai khoan Admin thanh cong!',
                data: admin
            })
        } catch (error) {
            return reject(error)
        }
    })
}

const createStaff = (newStaff) =>{
    return new Promise(async(resolve, reject) => {
        const {name, email, phone, password, confirmPassword, role} = newStaff
        try {
            const checkStaff = await Staff.findOne({
                admin_name: name, 
                admin_email: email
            })
            if(checkStaff){
                return reject({
                    status: 'ERROR',
                    message: 'Tai khoan Staff da ton tai'
                })
            }

            const hash = await bcrypt.hash(password, 10)
            const staff = await Staff.create({
                staff_email: email,
                staff_name: name,
                staff_phone: phone,
                staff_password: hash,
                staff_role: role
            })

            console.log(staff)
            return resolve({
                status: 'OK',
                message: 'Tao tai khoan staff thanh cong!',
                data: staff
            })
        } catch (error) {
            return reject(error)
        }
    })
}

module.exports = {
    signIn,
    createAdmin,
    createStaff
}