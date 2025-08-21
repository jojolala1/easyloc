const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const { connectMongo } = require('./config/database');

// Import des routes
const customerRoutes = require('./routes/customerRoutes');
const vehicleRoutes = require('./routes/vehicleRoutes');

// Configuration de l'application
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
    credentials: true
}));

// Limitation du taux de requêtes
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limite chaque IP à 100 requêtes par fenêtre
    message: {
        error: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
    }
});
app.use('/api/', limiter);

// Middleware de logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Middleware de validation des données
app.use((req, res, next) => {
    if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Le corps de la requête ne peut pas être vide'
            });
        }
    }
    next();
});

// Routes de l'API
app.use('/api/customers', customerRoutes);
app.use('/api/vehicles', vehicleRoutes);

// Route de santé de l'API
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'API EasyLoc opérationnelle',
        timestamp: new Date().toISOString(),
        version: '1.0.0'
    });
});

// Route racine
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Bienvenue sur l\'API EasyLoc',
        version: '1.0.0',
        documentation: '/api/health'
    });
});

// Middleware de gestion des erreurs 404
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} non trouvée`
    });
});

// Middleware de gestion globale des erreurs
app.use((error, req, res, next) => {
    console.error('Erreur globale:', error);

    // Erreurs de validation Mongoose
    if (error.name === 'ValidationError') {
        const validationErrors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({
            success: false,
            message: 'Erreur de validation',
            errors: validationErrors
        });
    }

    // Erreurs de duplication (clés uniques)
    if (error.code === 11000) {
        const field = Object.keys(error.keyValue)[0];
        return res.status(400).json({
            success: false,
            message: `Un enregistrement avec cette ${field} existe déjà`
        });
    }

    // Erreurs de cast (ID invalide)
    if (error.name === 'CastError') {
        return res.status(400).json({
            success: false,
            message: 'Format d\'ID invalide'
        });
    }

    // Erreur par défaut
    res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne du serveur'
    });
});

// Fonction de démarrage de l'application
const startApp = async () => {
    try {
        // Connexion à MongoDB
        await connectMongo();
        console.log('✅ Connexion à MongoDB établie');

        // Démarrage du serveur
        app.listen(PORT, () => {
            console.log(`🚀 Serveur démarré sur le port ${PORT}`);
            console.log(`📖 Documentation: http://localhost:${PORT}/api/health`);
            console.log(`🌍 Environnement: ${process.env.NODE_ENV || 'development'}`);
        });
    } catch (error) {
        console.error('❌ Erreur lors du démarrage de l\'application:', error);
        process.exit(1);
    }
};

// Gestion de l'arrêt gracieux
process.on('SIGTERM', () => {
    console.log('🛑 Signal SIGTERM reçu, arrêt gracieux...');
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Signal SIGINT reçu, arrêt gracieux...');
    process.exit(0);
});

// Démarrage de l'application
startApp();

module.exports = app;
