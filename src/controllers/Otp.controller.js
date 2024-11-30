const emailService = require('../services/Email.service');

// Controller cho việc gửi OTP qua email
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: 'Email là bắt buộc' });
  }

  try {
    await emailService.sendOtp(email);
    res.status(200).json({status: 'OK', message: 'OTP đã được gửi tới email của bạn!' });
  } catch (error) {
    res.status(500).json({status: 'ERROR', message: 'Lỗi khi gửi OTP', error });
  }
};

// Controller cho việc xác thực OTP qua email
exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({status: 'ERROR', message: 'Email và mã OTP là bắt buộc' });
  }

  const isVerified = await emailService.verifyOtp(email, otp);
  if (isVerified) {
    res.status(200).json({status: 'OK', message: 'Xác thực OTP thành công!' });
  } else {
    res.status(400).json({status: 'ERROR', message: 'Mã OTP không hợp lệ hoặc đã hết hạn' });
  }
};
