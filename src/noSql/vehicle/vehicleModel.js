const mongoose = require('mongoose')

const VehicleSchema = new mongoose.Schema({
    licence_plate: String,
    informations: String,
    km: Number
}, { collection: 'vehicle' })

const VehicleModel = new mongoose.model('vehicle', VehicleSchema)

module.exports = VehicleModel