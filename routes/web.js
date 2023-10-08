const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController') 
const cartController = require('../app/http/controllers/customers/cartController')
const orderController = require('../app/http/controllers/customers/orderController')
const adminHomeController = require('../app/http/controllers/admin/adminHomeController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const adminstatusController = require('../app/http/controllers/admin/statusController')
const searchController=require('../app/http/controllers/searchController')



// Middlewares 
const guest = require('../app/http/middlewares/guest')
const auth = require('../app/http/middlewares/auth')
const admin = require('../app/http/middlewares/admin')

function initRoutes(app) {
    app.get('/', homeController().index)
    app.get('/about', homeController().about)
    app.get('/login', guest, authController().login)
    app.post('/login', authController().postLogin)
    app.get('/register', guest, authController().register)
    app.get('/api/search', searchController().index)
    app.get('/pizza-details/:id',searchController().details)
    app.post('/register', authController().postRegister)
    app.post('/logout', authController().logout)

    app.get('/cart', cartController().index)
    app.post('/update-cart', cartController().update)
    app.delete('/delete-item',cartController().delete)

    // Customer routes
    app.post('/orders', auth, orderController().store)
    app.get('/customer/orders', auth, orderController().index)
    app.get('/customer/orders/:id', auth, orderController().show)

    // Admin routes
    app.get('/adminHome',admin,adminHomeController().index)
    app.get('/admin/orders', admin, adminOrderController().index)
    app.get('/completedOrders',admin,adminHomeController().completedOrders)
    app.get('/addItem',admin,adminHomeController().addItem)
    app.post('/addItem',admin,adminHomeController().additem)
    app.post('/admin/order/status', admin, adminstatusController().update)
    
}

module.exports = initRoutes

