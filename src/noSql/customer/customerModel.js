const mongoose = require('mongoose')

const CustomerSchema = new mongoose.Schema({
    firstname: String,
    second_name: String,
    address: String,
    permit_number: String,
}, { collection: 'customer' })

const CustomerModel = new mongoose.model('customer', CustomerSchema)

module.exports = CustomerModel