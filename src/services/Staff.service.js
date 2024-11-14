const Staff = require('../models/Staff.model')
const bcrypt = require('bcrypt')

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

module.exports = {
    changePassword,
    updateStaff
}