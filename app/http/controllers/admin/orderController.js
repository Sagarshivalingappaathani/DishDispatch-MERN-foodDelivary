const order = require("../../../models/order")

function orderController() {
    return {
        index(req, res) {
            order.find({ status: { $ne: 'completed' } }, null, { sort: { 'createdAt': -1 } })
            .populate('customerId', '-password')
            .then((orders) => {
                if (req.xhr) {
                    return res.json(orders);
                } else {
                    return res.render('admin/orders');
                }
            })
            .catch((err) => {
                console.error('Error fetching orders:', err);
                // Handle the error, e.g., by sending an error response
                return res.status(500).json({ message: 'Something went wrong' });
            });
        
        }
    }
}

module.exports = orderController