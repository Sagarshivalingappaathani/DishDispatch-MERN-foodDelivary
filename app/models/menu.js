const mongoose = require('mongoose')
const Schema = mongoose.Schema


const menuSchema = new Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    tag: { type: String, required: true },
    image: { type: String, required: true },
    offer: { type: Number, required: true },
    cuisine: { type: String, required: true },
    size: { type: String, required: true }
})

module.exports = mongoose.model('Menu', menuSchema)