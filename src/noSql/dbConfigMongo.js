const mongoose = require('mongoose')

const connectMongo = async (uri) => {
    await mongoose.connect(uri)
    .catch(err => {
        console.error('probleme connection mongoDb');
        throw err
    })
    
}

module.exports = connectMongo