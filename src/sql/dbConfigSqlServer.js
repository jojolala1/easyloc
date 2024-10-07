const sql = require('mssql')

const connectSql = async () => {
    const config = {
        server: process.env.SQL_SERVER,  
        database: process.env.SQL_DATABASE,
        user: process.env.SQL_USER, 
        password: process.env.SQL_PASSWORD,
        options: {
            encrypt: false,
        },
        port: 1433
    };
    try {
        await sql.connect(config);
        console.log('Connecté à SQL Server');
    } catch (err) {
        console.error('Erreur de connexion à SQL Server :', err);
    }
};


module.exports = connectSql