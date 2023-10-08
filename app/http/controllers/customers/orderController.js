const Order = require('../../../models/order')
const moment = require('moment')
function orderController () {
    return {
        store(req, res) {
            const { phone, address } = req.body;
            if (!phone || !address) {
                return res.status(422).json({ message: 'All fields are required' });
            }
        
            const order = new Order({
                customerId: req.user._id,
                items: req.session.cart.items,
                price: req.session.cart.totalPrice,
                phone,
                address,
            });
        
            order
                .save()
                .then((result) => {
                    return Order.populate(result, { path: 'customerId' });
                })
                .then((placedOrder) => {
                    req.flash('success', 'Order placed successfully');
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced', placedOrder)
                    delete req.session.cart;
                    return res.redirect("/customer/orders")        
                })
                .catch((err) => {
                    console.error('Error saving order:', err);
                    return res.status(500).json({ message: 'Something went wrong' });
                });
        },
        
        async index(req, res) {
            try {
                const orders = await Order.find({ customerId: req.user._id })
                    .sort({ 'createdAt': -1 })
                    .lean();
        
                res.header('Cache-Control', 'no-store');
                res.render('customers/orders', { orders, moment });
            } catch (error) {
                console.error('Error fetching orders:', error);
                // Handle the error, e.g., by sending an error response
                res.status(500).json({ message: 'Something went wrong' });
            }
        },

        async show(req, res) {
            const order = await Order.findById(req.params.id)
            // Authorize user
            if(req.user._id.toString() === order.customerId.toString()) {
                return res.render('customers/singleOrder', { order })
            }
            return  res.redirect('/')
        }
        
    }
}

module.exports = orderController