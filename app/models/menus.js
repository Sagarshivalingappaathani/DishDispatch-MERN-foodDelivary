const mongoose = require('mongoose')
const Schema = mongoose.Schema


const foodSchema = new Schema({
    foodname: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    offer: { type: String, required: true }
})

module.exports = mongoose.model('food', foodSchema)