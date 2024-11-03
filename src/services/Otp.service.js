const redis = require('redis');
const twilio = require('twilio');
require('dotenv').config();

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
const redisClient = redis.createClient();

redisClient.connect().catch(console.error);

const sendOtp = async (phoneNumber) => {
  const otp = Math.floor(100000 + Math.random() * 900000); // Tạo mã OTP 6 chữ số
  console.log(otp)
  // Lưu OTP vào Redis với thời gian hết hạn là 10 phút (600 giây)
  await redisClient.setEx(phoneNumber, 600, otp);
  console.log(otp)
  // Gửi OTP qua SMS
  const mess = await client.messages.create({
    body: `Mã xác thực của bạn là: ${otp}`,
    from: process.env.TWILIO_PHONE_NUMBER,
    to: phoneNumber
  });

  console.log( mess.sid)
};

const verifyOtp = async (phoneNumber, otp) => {
  const storedOtp = await redisClient.get(phoneNumber);

  if (storedOtp === otp) {
    await redisClient.del(phoneNumber); // Xóa OTP khỏi Redis sau khi xác thực thành công
    return true;
  }
  return false;
};

module.exports = {
    sendOtp,
    verifyOtp
}