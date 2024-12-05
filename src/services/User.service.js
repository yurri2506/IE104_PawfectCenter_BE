const User = require('../models/User.model')
const Cart = require('../models/Cart.model')
const Favor = require('../models/Favor.model')

const bcrypt = require('bcrypt')
const { genneralAccessToken, genneralRefreshToken } = require('./Jwt.service')
const { messaging } = require('firebase-admin')
const { google } = require('googleapis');

const signUpPhone = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { phone, name, password, confirmPassword } = newUser
        try {
            const checkUser = await User.findOne({
                user_phone: phone
            })

            if (checkUser !== null) {
                reject({
                    status: 'ERROR',
                    message: 'So dien thoai da ton tai'
                })
            } else {
                const hash = await bcrypt.hash(password, 10);
                const createUser = await User.create({
                    user_phone: phone,
                    user_name: name,
                    user_password: hash,
                    user_avt_img: "",
                    user_address: []
                })


                console.log(createUser)
                if (createUser) {
                    await Cart.create({
                        user_id: createUser._id
                    })

                    await Favor.create({
                        user_id: createUser._id
                    })

                    resolve({
                        status: 'OK',
                        message: 'Dang ky thanh cong',
                        data: createUser
                    })
                }
            }

        } catch (err) {
            reject({
                status: 'ERROR',
                message: 'Loi khi dang ky nguoi dung',
                error: err.message
            })
        }
    })
}

const signUpEmail = (newUser) => {
    return new Promise(async (resolve, reject) => {
        const { email, name, password, confirmPassword } = newUser
        try {
            const checkUser = await User.findOne({
                user_email: email
            })

            if (checkUser !== null) {
                reject({
                    status: 'ERROR',
                    message: 'Email da ton tai'
                })
            } else {
                const hash = await bcrypt.hash(password, 10);
                const createUser = await User.create({
                    user_email: email,
                    user_name: name,
                    user_password: hash
                })
                console.log(createUser)
                if (createUser) {
                    resolve({
                        status: 'OK',
                        message: 'Dang ky thanh cong',
                        data: createUser
                    })
                }
            }

        } catch (err) {
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

const getDetailUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        const user = await User.findById(userId)
        try {
            if (user === null) {
                return reject({
                    status: 'ERROR',
                    message: 'Nguoi dung khong ton tai'
                })
            } else {
                return resolve({
                    status: 'OK',
                    message: 'Thanh cong',
                    data: user
                })
            }
        } catch (err) {
            reject(err)
        }
    })
}

// const editUser = (userEdited, userId) => {
//     return new Promise(async (resolve, reject) => {
//         //const { name, full_name, email, phone, sex, birth } = userEdited
//         try {
//             const user = await User.findById(userId)
//             if (!user) {
//                 return reject({
//                     status: "ERROR",
//                     message: "Tai khoan khong ton tai"
//                 })
//             } else {
//                 // const editUser = await User.findByIdAndUpdate(
//                 //     userId,
//                 //     {
//                 //         user_name: name !== undefined ? name : user.user_name,
//                 //         full_name: full_name !== undefined ? full_name : user.full_name,
//                 //         user_email: email !== undefined ? email : user.user_email,
//                 //         user_phone: phone !== undefined ? phone : user.user_phone,
//                 //         user_sex: sex !== undefined ? sex : user.user_sex,
//                 //         user_birth: birth !== undefined ? birth : user.user_birth,
//                 //     },  
//                 //     { new: true } // Tùy chọn trả về tài liệu sau khi cập nhật
//                 // );
//                 const editUser = await User.findByIdAndUpdate(
//                     userId, userEdited,
//                     { new: true, runValidators: true } // Tùy chọn trả về tài liệu sau khi cập nhật
//                 );
//                 return resolve({
//                     status: 'OK',
//                     message: 'Chinh sua thanh cong',
//                     data: editUser
//                 })
//             }
//         } catch (err) {
//             reject(err)
//         }
//     })
// }

const editUser = (userEdited, userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            // Kiểm tra tài khoản có tồn tại hay không
            const user = await User.findById(userId);
            if (!user) {
                return reject({
                    status: "ERROR",
                    message: "Tài khoản không tồn tại",
                });
            }

            // Kiểm tra email hoặc số điện thoại đã tồn tại
            const { user_email, user_phone } = userEdited;

            if (user_email) {
                const emailExists = await User.findOne({ user_email, _id: { $ne: userId } });
                if (emailExists) {
                    return reject({
                        status: "ERROR",
                        message: "Email đã được sử dụng bởi tài khoản khác",
                    });
                }
            }

            if (user_phone) {
                const phoneExists = await User.findOne({ user_phone, _id: { $ne: userId } });
                if (phoneExists) {
                    return reject({
                        status: "ERROR",
                        message: "Số điện thoại đã được sử dụng bởi tài khoản khác",
                    });
                }
            }

            // Cập nhật tài khoản
            const updatedUser = await User.findByIdAndUpdate(userId, userEdited, {
                new: true,
                runValidators: true, // Chạy validate theo schema
            });

            return resolve({
                status: "OK",
                message: "Chỉnh sửa thành công",
                data: updatedUser,
            });
        } catch (err) {
            return reject({
                status: "ERROR",
                message: "Đã xảy ra lỗi trong quá trình chỉnh sửa",
                error: err.message,
            });
        }
    });
};



const checkCurrentPass = (data, userId) => {
    return new Promise(async (resolve, reject) => {
        const { password } = data
        try {
            const user = await User.findById(userId)

            if (!user) {
                return reject({
                    status: "ERROR",
                    message: "Tai khoan khong ton tai"
                })
            } else {
                const isPasswordCorrect = await bcrypt.compare(password, user.user_password);
                if (!isPasswordCorrect) {
                    return reject({
                        status: 'ERROR',
                        message: 'Mật khẩu không chính xác'
                    });
                }

                return resolve({
                    status: 'OK',
                    message: 'Mat khau la chinh xac',
                })
            }

        } catch (err) {
            reject(err)
        }
    })
}

const changePassword = (data, userId) => {
    return new Promise(async (resolve, reject) => {
        const { newPassword, confirmNewPass } = data
        try {
            const user = await User.findById(userId)

            if (!user) {
                return reject({
                    status: "ERROR",
                    message: "Tai khoan khong ton tai"
                })
            } else {
                // const isPasswordCorrect = await bcrypt.compare(password, user.user_password);
                // if (!isPasswordCorrect) {
                //     return reject({
                //         status: 'ERROR',
                //         message: 'Mật khẩu không chính xác'
                //     });
                // }

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

        } catch (err) {
            reject(err)
        }
    })
}

// const forgetPassword = (data) =>{
//     return new Promise(async(resolve, reject) =>{
//         const{email, phone, newPassword, confirmNewPass} = data
//         try {
//             let user
//             if(email && !phone){
//                 user = await User.findOne({
//                     user_email: email
//                 })
//             }
//             if(!email && phone){
//                 user = await User.findOne({
//                     user_phone: phone
//                 })
//             }

//             if(!user){
//                 return reject({
//                     status: 'ERROR',
//                     message: 'Tai khoan nay chua duoc dang ky'
//                 })
//             }

//             const hash = bcrypt.hashSync(newPassword, 10)
//             const editUser = await User.findByIdAndUpdate(
//                 user._id,
//                 {
//                     user_password: hash
//                 },
//                 {new: true}
//             )

//             return resolve({
//                 status: 'Successfully',
//                 message: 'Dat lai mat khau thanh cong',
//                 data: editUser
//             })
//         } catch (err) {
//             return reject({
//                 status: 'ERROR',
//                 message: err.message
//             })
//         }
//     })
// }


const forgetPassword = (data) => {
    const { identifier, newPassword } = data;

    return new Promise(async (resolve, reject) => {
        try {

            let query = {};
            if (/^\S+@\S+\.\S+$/.test(identifier)) {
                query = { user_email: identifier };
            } else if (/^\d{10,15}$/.test(identifier)) {
                query = { user_phone: identifier };
            } else {
                return reject({
                    status: 'ERROR',
                    message: 'Định dạng không hợp lệ. Vui lòng nhập email hoặc số điện thoại.',
                });
            }

            const user = await User.findOne(query);
            if (!user) {
                return reject({
                    status: 'ERROR',
                    message: 'Tài khoản này chưa được đăng ký.',
                });
            }

            const hash = bcrypt.hashSync(newPassword, 10);
            const updatedUser = await User.findByIdAndUpdate(
                user._id,
                { user_password: hash },
                { new: true }
            );

            return resolve({
                status: 'SUCCESS',
                message: 'Đặt lại mật khẩu thành công.',
                data: updatedUser,
            });
        } catch (err) {
            return reject({
                status: 'ERROR',
                message: err.message || 'Lỗi khi đặt lại mật khẩu.',
            });
        }
    });
};

const deleteUser = (userId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(userId)
            if (!user) {
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
                { new: true }
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

const addAddress = (userId, newAddress) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(userId)
            if (!user) {
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
                { new: true }
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

const updateAddress = (userId, addressId, addressData) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return reject({
                    status: 'ERROR',
                    message: 'Người dùng không tồn tại',
                });
            }

            // Tìm địa chỉ cần cập nhật
            const address = user.user_address.id(addressId);
            if (!address) {
                return reject({
                    status: 'ERROR',
                    message: 'Địa chỉ không tồn tại',
                });
            }

            // Nếu `isDefault` là true, hủy mặc định các địa chỉ khác
            if (addressData.isDefault) {
                await User.updateOne(
                    { _id: userId, "user_address.isDefault": true },
                    { $set: { "user_address.$.isDefault": false } }
                );
            }

            // Cập nhật các trường cho địa chỉ
            address.name = addressData.name || address.name;
            address.phone = addressData.phone || address.phone;
            address.home_address = addressData.home_address || address.home_address;
            address.province = addressData.province || address.province;
            address.district = addressData.district || address.district;
            address.commune = addressData.commune || address.commune;
            address.isDefault = addressData.isDefault || address.isDefault;

            // Lưu thay đổi
            await user.save();

            resolve({
                status: 'Successfully',
                message: 'Cập nhật địa chỉ thành công',
                data: user.user_address,
            });
        } catch (err) {
            reject({
                status: 'ERROR',
                message: 'Lỗi trong quá trình cập nhật địa chỉ',
                error: err,
            });
        }
    });
};


const deleteAddress = (userId, addressId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findById(userId);
            if (!user) {
                return reject({
                    status: 'ERROR',
                    message: 'Người dùng không tồn tại',
                });
            }

            // Kiểm tra xem địa chỉ có tồn tại hay không
            const addressIndex = user.user_address.findIndex((addr) => addr._id.toString() === addressId.toString());

            // Nếu không tìm thấy địa chỉ
            if (addressIndex === -1) {
                return reject({
                    status: 'ERROR',
                    message: 'Địa chỉ không tồn tại',
                });
            }

            // Xóa địa chỉ khỏi danh sách
            user.user_address.splice(addressIndex, 1); // Loại bỏ địa chỉ bằng splice

            // Lưu thay đổi
            await user.save();

            return resolve({
                status: 'Successfully',
                message: 'Xóa địa chỉ thành công',
                data: user.user_address, // Trả về danh sách địa chỉ còn lại
            });
        } catch (error) {
            return reject({
                status: 'ERROR',
                message: 'Lỗi trong quá trình xóa địa chỉ',
                error: error.message,
            });
        }
    });
};



const setAddressDefault = (userId, addressId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const user = await User.findOne({
                _id: userId,
                "user_address._id": addressId
            })
            if (!user) {
                return reject({
                    status: 'ERROR',
                    message: 'Tai khoan nay khong ton tai hoac dia chi khong ton tai'
                })
            }

            await User.updateOne(
                { _id: userId, "user_address.isDefault": true },
                { $set: { "user_address.$.isDefault": false } }
            )

            await User.updateOne(
                { _id: userId, "user_address._id": addressId },
                { $set: { "user_address.$.isDefault": true } }
            )

            const updatedUser = await User.findOne({ _id: userId });

            return resolve({
                status: "Successfully",
                message: 'Dat dia chi mac dinh thanh cong',
                data: updatedUser.user_address,
            })
        } catch (err) {
            return reject(err)
        }
    })
}

const getAllUser = () => {
    return new Promise(async (resolve, reject) => {
        try {
            const allUser = await User.find().sort({ createdAt: -1, updatedAt: -1 })
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

const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_CALLBACK_URL
);
const axios = require('axios');

const signInGoogle = (googleAccessToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const userInfoResponse = await axios.get('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: {
                    Authorization: `Bearer ${googleAccessToken}`,
                },
            });

            const { email, name, sub: googleId } = userInfoResponse.data;

            let user = await User.findOne({ user_email: email });

            const hashedPassword = await bcrypt.hash("", 10);

            if (!user) {
                user = await User.create({
                    user_email: email,
                    user_name: name,
                    google_id: googleId,
                    user_address: [],
                    user_password: hashedPassword,
                });
            }

            if (user) {
                await Cart.create({
                    user_id: user._id
                })

                await Favor.create({
                    user_id: user._id
                })
            }

            const access_token = await genneralAccessToken({
                id: user.id,
            });
            const refresh_token = await genneralRefreshToken({
                id: user.id,
            });

            return resolve({
                status: 'OK',
                message: 'Đăng nhập thành công',
                ACCESS_TOKEN: access_token,
                REFRESH_TOKEN: refresh_token,
            });

        } catch (error) {
            return reject({
                status: 'FAIL',
                message: 'Đăng nhập thất bại',
                error: error.message,
            });
        }
    });
};

module.exports = {
    signUpPhone,
    signUpEmail,
    signIn,
    getDetailUser,
    editUser,
    checkCurrentPass,
    changePassword,
    forgetPassword,
    deleteUser,
    addAddress,
    updateAddress,
    deleteAddress,
    setAddressDefault,
    getAllUser,
    signInGoogle
}