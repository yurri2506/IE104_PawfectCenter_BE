const cloudinary = require('cloudinary').v2;
require('dotenv').config();

// Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Hàm upload ảnh lên Cloudinary
const uploadImage = async (fileBuffer, folder = 'Pawfect_image_upload') => {
  try {
    const uploadOptions = {
      use_filename: true,
      unique_filename: true,
      resource_type: 'auto',
      folder: folder, // Thư mục lưu ảnh trên Cloudinary
    };

    // Bọc upload_stream trong Promise để hỗ trợ async/await
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        uploadOptions,
        (error, result) => {
          if (error) {
            console.error("Error uploading to Cloudinary:", error);
            reject(error); // Trả về lỗi nếu upload thất bại
          } else {
            resolve(result.secure_url); // Trả về URL nếu upload thành công
          }
        }
      );
      uploadStream.end(fileBuffer); // Truyền buffer vào stream
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

module.exports = { cloudinary, uploadImage };
