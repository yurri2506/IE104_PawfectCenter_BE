const Discount = require('../models/DiscountModel')
const Feedback = require('../models/FeedbackModel')

UserRouter = require('./UserRouter')
ProductRouter = require('./PrductRouter')
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
}   


module.exports = routes