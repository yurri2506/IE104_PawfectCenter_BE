const Joi = require('joi');

const userSignUpPhone = Joi.object({
    phone: Joi.string()
        .pattern(/^[0-9]{10,11}$/) // Kiểm tra xem có phải số với độ dài 10-11 ký tự không
        .required()
        .messages({
            'string.empty': 'Số điện thoại là bắt buộc.',
            'any.required': 'Số điện thoại là bắt buộc.',
            'string.pattern.base': 'Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại đúng định dạng (10-11 chữ số).'
        }
    ),
    name: Joi.string().required().messages({
        'string.empty': 'Tên là bắt buộc.',
        'any.required': 'Tên là bắt buộc.'
    }),
    password: Joi.string().min(8).required().messages({
        'string.empty': 'Mật khẩu là bắt buộc.',
        'any.required': 'Mật khẩu là bắt buộc.',
        'string.min': 'Mật khẩu phải có ít nhất 8 ký tự.'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Mật khẩu xác nhận không khớp.',
        'any.required': 'Mật khẩu xác nhận là bắt buộc.'
    }),
});

const userSignUpEmail = Joi.object({
    email: Joi.string()
        .email({ tlds: { allow: false } }) // Kiểm tra định dạng email
        .required()
        .messages({
            'string.empty': 'Email là bắt buộc.',
            'any.required': 'Email là bắt buộc.',
            'string.email': 'Email không hợp lệ. Vui lòng nhập đúng định dạng email.'
        }),
    name: Joi.string().required().messages({
        'string.empty': 'Tên là bắt buộc.',
        'any.required': 'Tên là bắt buộc.'
    }),
    password: Joi.string().min(8).required().messages({
        'string.empty': 'Mật khẩu là bắt buộc.',
        'any.required': 'Mật khẩu là bắt buộc.',
        'string.min': 'Mật khẩu phải có ít nhất 8 ký tự.'
    }),
    confirmPassword: Joi.string().valid(Joi.ref('password')).required().messages({
        'any.only': 'Mật khẩu xác nhận không khớp.',
        'any.required': 'Mật khẩu xác nhận là bắt buộc.'
    }),
});

module.exports = {
    userSignUpPhone,
    userSignUpEmail
}
