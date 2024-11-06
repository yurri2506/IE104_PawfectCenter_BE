const UserRouter = require('./User.router')
const ProductRouter = require('./Product.router')
const CategoryRouter = require('./Category.router')
const OrderRouter = require('./Order.router')
const AdminRouter = require('./Admin.router')
const CartRouter = require('./Cart.router')
const DiscountRouter = require('./Discount.router')
const FeedbackRouter = require('./Feedback.router')
const FavoritedRouter = require('./Favorited.router')
const StoreRouter = require('./Store.router')
const NotificationRouter = require('./Notification.router')

const routes = (app) => {
    // app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/category', CategoryRouter)
    app.use('/api/order', OrderRouter)
    // app.use('/api/admin', AdminRouter)
    // app.use('/api/cart', CartRouter)
    // app.use('/api/discount', DiscountRouter)
    // app.use('/api/feedback', FeedbackRouter)
    // app.use('/api/favorited', FavoritedRouter)
    // app.use('/api/store', StoreRouter)
    // app.use('/api/notification', NotificationRouter)
}   

module.exports = routes;