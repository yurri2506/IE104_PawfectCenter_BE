const Joi = require('joi');

const changePasswordSchema = Joi.object({
    password: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.empty': 'Mật khẩu hiện tại là bắt buộc.',
            'any.required': 'Mật khẩu hiện tại là bắt buộc.',
            'string.min': 'Mật khẩu hiện tại phải có ít nhất 8 ký tự.'
        }),
    newPassword: Joi.string()
        .min(8)
        .required()
        .messages({
            'string.empty': 'Mật khẩu mới là bắt buộc.',
            'any.required': 'Mật khẩu mới là bắt buộc.',
            'string.min': 'Mật khẩu mới phải có ít nhất 8 ký tự.'
        }),
    confirmNewPass: Joi.string()
        .valid(Joi.ref('newPassword'))
        .required()
        .messages({
            'any.only': 'Mật khẩu xác nhận không khớp với mật khẩu mới.',
            'any.required': 'Mật khẩu xác nhận là bắt buộc.'
        }),
})

module.exports = {
    changePasswordSchema
}