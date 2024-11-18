const nodemailer = require('nodemailer');
const crypto = require('crypto');
const dotenv = require('dotenv')

dotenv.config()

const redisClient = require('./redis.service')

// Tạo transporter để gửi email OTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL,//'phamquangvu2308@gmail.com', // thay bằng email của bạn
    pass: process.env.PASSWORD//'osqm qrgm ddqh vmed'    // thay bằng mật khẩu của bạn
  }
});

// Hàm gửi OTP qua email
const sendOtp = async (email) => {
  // Tạo mã OTP ngẫu nhiên
  const otp = crypto.randomInt(100000, 999999).toString(); // Tạo OTP 6 chữ số

  try {
    // Lưu OTP vào Redis với thời gian sống là 5 phút
    await redisClient.setEx(`otp:${email}`, 300, otp); // 300 giây = 5 phút

    // Cấu hình nội dung email
    const mailOptions = {
      from: 'your-email@gmail.com',
      to: email,
      subject: 'Your OTP Code',
      text: `Your OTP code is: ${otp}`
    };

    // Gửi email
    await transporter.sendMail(mailOptions);
    console.log('OTP email sent and saved to Redis');
  } catch (error) {
    console.error('Error sending OTP email or saving to Redis:', error);

  }
};

// Hàm xác thực OTP
const verifyOtp = async(email, otp) =>{
    try {
      // Lấy OTP từ Redis
      console.log(typeof otp)
      const storedOtp = await redisClient.get(`otp:${email}`);
      console.log(storedOtp)
      // Kiểm tra OTP
      if (storedOtp !== null && storedOtp.toString() === otp.toString()) {
        await redisClient.del(`otp:${email}`); // Xóa OTP sau khi xác thực thành công
        console.log('Da xoa')
        return true; // OTP hợp lệ
      } else {
        return false; // OTP không hợp lệ hoặc không tồn tại
      }
    } catch (error) {
      console.error('Error verifying OTP:', error);
      return false;
    }
  }



module.exports = { sendOtp, verifyOtp };
