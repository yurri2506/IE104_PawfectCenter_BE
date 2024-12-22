const Staff = require('../models/Staff.model')
const bcrypt = require('bcrypt')

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

const changePassword = (data, id) => {
    return new Promise(async (resolve, reject) => {
        const{password, newPassword, confirmNewPass} = data
        try {
            const staff = await Staff.findById(id)

            if (!staff) {
                return reject({
                    status: 'ERROR',
                    message: 'Tài khoản không tồn tại'
                });
            }
            const checkPassword = await bcrypt.compare(password, staff.staff_password)
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

            const updateStaff = await Staff.findByIdAndUpdate(
                id, 
                { 
                    staff_password: hashedPassword 
                },
                {
                    new: true
                }
            );

            return resolve({
                status: 'OK',
                message: 'Mật khẩu đã được cập nhật thành công',
                updateStaff: updateStaff
            });
        } catch (error) {
            return reject(error);
        }
    });
};

const updateStaff = (data, id) => {
    return new Promise(async (resolve, reject) => {
        const{name, email, phone} = data
        try {
            const staff = await Staff.findById(id)

            if (!staff) {
                return reject({
                    status: 'ERROR',
                    message: 'Tài khoản không tồn tại'
                });
            }
            
            const updateStaff = await Staff.findByIdAndUpdate(
                id, 
                { 
                    staff_name: name,
                    staff_email: email,
                    staff_phone: phone
                },
                {
                    new: true
                }
            );

            return resolve({
                status: 'OK',
                message: 'Thong tin duoc cap nhat thanh cong',
                updateStaff: updateStaff
            });
        } catch (error) {
            return reject(error);
        }
    });
};

const getAllStaff = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allStaff = await Staff.find().sort({createdAt: -1, updatedAt: -1})
            return resolve({
                status: 'OK',
                message: 'Success',
                data: allStaff
            })
        } catch (e) {
            return reject(e)
        }
    })
}

const getDetailStaff = (staffId)=>{
    return new Promise( async(resolve, reject)=>{
        const staff = await Staff.findById(staffId)
        try{
            if(staff === null){
                return reject({
                    status: 'ERROR',
                    message: 'Nhan vien khong ton tai'
                })
            }else{
                return resolve({
                    status: 'OK',
                    message: 'Thanh cong',
                    data: staff
                })
            }
        }catch(err){
            reject(err)
        }
    })
  }

  const updateRoleStaff = (data, id) => {
    return new Promise(async (resolve, reject) => {
        const{role} = data
        try {
            const staff = await Staff.findById(id)

            if (!staff) {
                return reject({
                    status: 'ERROR',
                    message: 'Tài khoản không tồn tại'
                });
            }
            
            const updateStaff = await Staff.findByIdAndUpdate(
                id, 
                { 
                    staff_role: role
                },
                {
                    new: true
                }
            );

            return resolve({
                status: 'OK',
                message: 'Thong tin duoc cap nhat thanh cong',
                updateStaff: updateStaff
            });
        } catch (error) {
            return reject(error);
        }
    });
};

const deleteStaff = ( id) => {
    return new Promise(async (resolve, reject) => {
        try {
            const staff = await Staff.findById(id)

            if (!staff) {
                return reject({
                    status: 'ERROR',
                    message: 'Tài khoản không tồn tại'
                });
            }
            
            const updateStaff = await Staff.findByIdAndUpdate(
                id, 
                { 
                    isDelete: true
                },
                {
                    new: true
                }
            );

            return resolve({
                status: 'OK',
                message: 'Thong tin duoc cap nhat thanh cong',
                updateStaff: updateStaff
            });
        } catch (error) {
            return reject(error);
        }
    });
};

module.exports = {
    createStaff,
    changePassword,
    updateStaff,
    getAllStaff,
    getDetailStaff,
    updateRoleStaff,
    deleteStaff
}