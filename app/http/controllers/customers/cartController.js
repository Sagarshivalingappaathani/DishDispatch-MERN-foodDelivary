const { json } = require("express")

function cartController() {
    return {
        index(req, res) {
            res.render('customers/cart')
        },
        update(req, res) {
            // let cart = {
            //     items: {
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //         pizzaId: { item: pizzaObject, qty:0 },
            //     },
            //     totalQty: 0,
            //     totalPrice: 0
            // }

            // for the first time creating cart and adding basic object structure
            
            if (!req.session.cart) {
                req.session.cart = {
                    items: {},
                    totalQty: 0,
                    totalPrice: 0
                }
            }
            let cart = req.session.cart

            // Check if item does not exist in cart 
            if(!cart.items[req.body.foodDetails._id]) {
                cart.items[req.body.foodDetails._id] = {
                    item: req.body.foodDetails,
                    qty: req.body.quantity
                }
                cart.totalQty = cart.totalQty + req.body.quantity
                cart.totalPrice = cart.totalPrice + Math.floor(req.body.foodDetails.price*(1-(req.body.foodDetails.offer)/100) *req.body.quantity)
            } else {
                cart.items[req.body.foodDetails._id].qty = cart.items[req.body.foodDetails._id].qty + req.body.quantity
                cart.totalQty = cart.totalQty + req.body.quantity
                cart.totalPrice =  cart.totalPrice + Math.floor(req.body.foodDetails.price*(1-(req.body.foodDetails.offer)/100) *req.body.quantity)
            }
            return res.json({ totalQty: req.session.cart.totalQty })
        },

        delete(req, res) {
            const pizzaId = req.body._id;
            const cart = req.session.cart;
        
            if (cart && cart.items && cart.items[pizzaId]) {
                const deletedItem = cart.items[pizzaId];
                const deletedItemPrice = Math.floor(deletedItem.item.price*(1-deletedItem.item.offer/100) * deletedItem.qty)
        
                // Update the totalQty and totalPrice
                cart.totalQty -= deletedItem.qty;
                cart.totalPrice -= deletedItemPrice;
        
                // Remove the item from the cart
                delete cart.items[pizzaId];
            }
        
            return res.json({ totalQty: req.session.cart.totalQty, totalPrice: Math.floor(req.session.cart.totalPrice) });
        }
        
    }
}

module.exports = cartController