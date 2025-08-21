const mongoose = require('mongoose');
const sql = require('mssql');

// Configuration MongoDB
const mongoConfig = {
    uri: process.env.MONGO_URI || 'mongodb://localhost:27017/easyloc',
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    }
};

// Configuration SQL Server
const sqlConfig = {
    server: process.env.SQL_SERVER || 'localhost',
    database: process.env.SQL_DATABASE || 'easyloc',
    user: process.env.SQL_USER || 'sa',
    password: process.env.SQL_PASSWORD || '',
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
    port: parseInt(process.env.SQL_PORT) || 1433
};

// Pool de connexions MongoDB
let mongoConnection = null;

// Pool de connexions SQL Server
let sqlPool = null;

// Connexion MongoDB
const connectMongo = async () => {
    try {
        if (!mongoConnection) {
            mongoConnection = await mongoose.connect(mongoConfig.uri, mongoConfig.options);
            console.log('Connecté à MongoDB');
        }
        return mongoConnection;
    } catch (error) {
        console.error('Erreur de connexion MongoDB:', error);
        throw error;
    }
};

// Connexion SQL Server
const connectSql = async () => {
    try {
        if (!sqlPool) {
            sqlPool = await sql.connect(sqlConfig);
            console.log('Connecté à SQL Server');
        }
        return sqlPool;
    } catch (error) {
        console.error('Erreur de connexion SQL Server:', error);
        throw error;
    }
};

// Fermeture des connexions
const closeConnections = async () => {
    try {
        if (mongoConnection) {
            await mongoose.disconnect();
            mongoConnection = null;
            console.log('🔌 Connexion MongoDB fermée');
        }
        if (sqlPool) {
            await sqlPool.close();
            sqlPool = null;
            console.log('🔌 Connexion SQL Server fermée');
        }
    } catch (error) {
        console.error('Erreur lors de la fermeture des connexions:', error);
    }
};

module.exports = {
    connectMongo,
    connectSql,
    closeConnections,
    mongoConfig,
    sqlConfig
};
