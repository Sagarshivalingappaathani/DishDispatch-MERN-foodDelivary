const mongoose = require('mongoose')
const ItemModel = require('../../models/menu'); // Adjust the path to your Item model file

function searchController() {
    return {
        async index(req, res) {

            const searchTerm = req.query.q; // Get the search term from the query string
            try {
                // Connect to the MongoDB database using Mongoose
                const pizzas = await mongoose.connection.db.collection('menus').find({
                name: { $regex: new RegExp(searchTerm, 'i') }, // Perform a case-insensitive search
                }).toArray();

                res.json(pizzas);
            } catch (err) {
                console.error(err);
                res.status(500).json({ error: 'Internal Server Error' });
            }
        },

        async details(req, res)  {
            const itemId = req.params.id; // Get the item ID from the route parameter
          
            try {
                // Fetch the item details from MongoDB using itemId
                // You can use Mongoose or your preferred method for this
                const pizzaDetails = await ItemModel.findById(itemId);
          
                if (!pizzaDetails) {
                    // Handle the case where the item is not found
                    return res.status(404).render('error', { message: 'Item not found' });
                }
          
                // Render the pizza-details.ejs page with the item's data
                res.render('pizza-details', { pizzaDetails});
            } catch (err) {
                console.error(err);
                res.status(500).render('error', { message: 'Internal Server Error' });
            }
        }
    }
}

module.exports = searchController