const Discount = require('../models/DiscountModel')
const Feedback = require('../models/FeedbackModel')

UserRouter = require('./UserRouter')
ProductRouter = require('./ProductRouter')
OrderRouter = require('./OrderRouter')
AdminRouter = require('./AdminRouter')
CartRouter = require('./CartRouter')
DiscountRouter = require('./DiscountRouter')
FeedbackRouter = require('./FeedbackRouter')
FavoritedRouter = require('./FavoritedRouter')
StoreRouter = require('./StoreRouter')
NotificationRouter = require('./NotificationRouter')

const routes = (app) =>{
    app.use('/api/user', UserRouter)
    app.use('/api/product', ProductRouter)
    app.use('/api/product', OrderRouter)
    app.use('/api/product', AdminRouter)
    app.use('/api/product', CartRouter)
    app.use('/api/product', DiscountRouter)
    app.use('/api/product', FeedbackRouter)
    app.use('/api/product', FavoritedRouter)
    app.use('/api/product', StoreRouter)
    app.use('/api/product', NotificationRouter)
}   

module.exports = routes