const Food = require('../../../models/menus')
const order = require("../../../models/order")

function adminHomeController() {
    return {
        index(req, res) {
            return res.render('admin/adminHome');
        },
        addItem(req,res){
            return res.render('admin/addFood')
        },
        additem(req,res){
            //console.log(req.body)
            const {foodname,image,price,offer} = req.body
                
                // Validate request 

                if(!foodname || !image || !price || !offer) {
                    req.flash('error', 'All fields are required')
                    req.flash('foodname', foodname)
                    req.flash('image', image)
                    req.flash('price', price)
                    req.flash('offer', offer)
                    return res.redirect('/addItem')
                }

                // Create a user 
                const food = new Food({
                    foodname,
                    image,
                    price,
                    offer
                });

                food.save()
                .then((food) => {
                    // Login
                    return res.redirect('/adminHome');
                })
                .catch((err) => {
                    req.flash('error', 'Something went wrong');
                    return res.redirect('/addItem');
                });
        },
        completedOrders(req,res){

            //console.log("skp")

            order.find({ status:  'completed'  }, null, { sort: { 'createdAt': -1 } })
            .populate('customerId', '-password')
            .then((orders) => {
                //console.log(orders)
                return res.render('admin/completedOrders',{orders:orders})
            })
            .catch((err) => {
                console.error('Error fetching orders:', err);
                // Handle the error, e.g., by sending an error response
                return res.status(500).json({ message: 'Something went wrong' });
            });
        



        }
}

}
module.exports = adminHomeController