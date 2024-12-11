const Notification = require('../models/Notification.model')

const createNotify = (data) =>{
    return new Promise (async(resolve, reject) =>{
        try {
            const { user_id, order_id, product_id, notify_type, notify_title, notify_desc } = data;
        
            const newNotification = new Notification({
              user_id: user_id || null,
              order_id,
              product_id,
              notify_type,
              notify_title,
              notify_desc
            });
        
            await newNotification.save();
            
            return resolve({
                status: 'OK',
                message: 'Thông báo đã được tạo thành công'
            })
          } catch (error) {
            return reject({
                status: 'ERROR',
                message: error.message
            })
          }
    })
}
const getAllNotify = (userId) => {
    return new Promise(async(resolve, reject)=>{
        try {
    
            const notifications = await Notification.find({
                $or: [
                    { user_id: userId }, 
                    { user_id: null }    
                ]
            }).sort({ createdAt: -1 }); 
            console.log(notifications)
            return resolve({
                status: 'OK',
                data: notifications,
                message: 'Lấy tất cả thông báo thành công.'
            })
        } catch (error) {
            console.error('Lỗi khi lấy thông báo:', error);
            return reject({
                status: 'ERROR',
                message: error.message
            })
        }
    })
}

const getDetailNotify = (notifyId) => {
    return new Promise(async(resolve, reject)=>{
        try {
            const notification = await Notification.findById(notifyId);

            if (!notification) {
                return reject({
                    status: 'ERROR',
                    message: 'Không tìm thấy thông báo với ID này.',
                })
            }
    
            notification.isRead = true; 
            await notification.save(); 
    
            return resolve({
                status: 'OK',
                data: notification,
                message: 'Chi tiết thông báo đã được lấy thành công và đánh dấu đã đọc.',
            })

        } catch (error) {
            console.error('Lỗi khi lấy thông báo:', error);
            return reject({
                status: 'ERROR',
                message: error.message
            })
        }
    })
}


const updateNotify = (notifyId, data) => {
    return new Promise(async(resolve, reject)=>{
        try {
    
            const notifications = await Notification.findByIdAndUpdate(
                notifyId, data, {
                    new: true,
                    runValidators: true}
            )

            console.log(notifications)
            return resolve({
                status: 'OK',
                data: notifications,
                message: 'Cap nhat thanh cong.'
            })
        } catch (error) {
            console.error('Lỗi khi cap nhat thông báo:', error);
            return reject({
                status: 'ERROR',
                message: error.message
            })
        }
    })
}

module.exports = {
    createNotify,
    getAllNotify,
    getDetailNotify,
    updateNotify
}