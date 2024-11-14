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
                    isAdmin: admin.isAdmin
                })
                    refresh_token = await genneralRefreshToken({
                    id: admin._id,
                    isAdmin: admin.isAdmin
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
                REFRESH_TOKEN: refresh_token,
                data: admin
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


const forgetPassword = (data) => {
    return new Promise(async (resolve, reject) => {
        const { email, newPassword, confirmNewPass } = data;
        try {
            const admin = await Admin.findOne({ admin_email: email });
            const staff = await Staff.findOne({ staff_email: email });

            if (!admin && !staff) {
                return reject({
                    status: 'ERROR',
                    message: 'Tài khoản không tồn tại'
                });
            }

            if (newPassword !== confirmNewPass) {
                return reject({
                    status: 'ERROR',
                    message: 'Mật khẩu xác nhận không khớp'
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);
            let update
            if (admin) {
                update = await Admin.updateOne({ admin_email: email }, { admin_password: hashedPassword }, {new: true});
            }

            if (staff) {
                update = await Staff.updateOne({ staff_email: email }, { staff_password: hashedPassword }, {new: true});
            }

            return resolve({
                status: 'OK',
                message: 'Mật khẩu đã được cập nhật thành công',
                update: update
            });
        } catch (error) {
            console.log(error)
            return reject(error);
        }
    });
};

const changePassword = (data, id) => {
    return new Promise(async (resolve, reject) => {
        const{password, newPassword, confirmNewPass} = data
        try {
            const admin = await Admin.findById(id)

            if (!admin) {
                return reject({
                    status: 'ERROR',
                    message: 'Tài khoản không tồn tại'
                });
            }
            const checkPassword = await bcrypt.compare(password, admin.admin_password)
            if(!checkPassword){
                return reject({
                    status: 'ERROR',
                    message: 'Mật khẩu không chính xác'
                });
            }

            if (newPassword !== confirmNewPass) {
                return reject({
                    status: 'ERROR',
                    message: 'Mật khẩu xác nhận không khớp'
                });
            }

            const hashedPassword = await bcrypt.hash(newPassword, 10);

            const updateAd = await Admin.findByIdAndUpdate(
                id, 
                { 
                    admin_password: hashedPassword 
                },
                {
                    new: true
                }
            );

            return resolve({
                status: 'OK',
                message: 'Mật khẩu đã được cập nhật thành công',
                updateAdmin: updateAd
            });
        } catch (error) {
            return reject(error);
        }
    });
};

const updateAdmin = (data, id) => {
    return new Promise(async (resolve, reject) => {
        const{name, email} = data
        try {
            const staff = await Admin.findById(id)

            if (!staff) {
                return reject({
                    status: 'ERROR',
                    message: 'Tài khoản không tồn tại'
                });
            }
            
            const updateAd = await Admin.findByIdAndUpdate(
                id, 
                { 
                    admin_name: name,
                    admin_email: email
                },
                {
                    new: true
                }
            );

            return resolve({
                status: 'OK',
                message: 'Thong tin duoc cap nhat thanh cong',
                updateAdmin: updateAd
            });
        } catch (error) {
            return reject(error);
        }
    });
};

module.exports = {
    signIn,
    createAdmin,
    createStaff,
    forgetPassword,
    changePassword,
    updateAdmin
}