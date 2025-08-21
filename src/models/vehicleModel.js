const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
    licence_plate: {
        type: String,
        required: [true, 'La plaque d\'immatriculation est requise'],
        unique: true,
        trim: true,
        uppercase: true,
        match: [/^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/, 'Format de plaque invalide (ex: AB-123-CD)']
    },
    brand: {
        type: String,
        required: [true, 'La marque est requise'],
        trim: true,
        minlength: [2, 'La marque doit contenir au moins 2 caractères'],
        maxlength: [50, 'La marque ne peut pas dépasser 50 caractères']
    },
    model: {
        type: String,
        required: [true, 'Le modèle est requis'],
        trim: true,
        minlength: [2, 'Le modèle doit contenir au moins 2 caractères'],
        maxlength: [50, 'Le modèle ne peut pas dépasser 50 caractères']
    },
    year: {
        type: Number,
        required: [true, 'L\'année est requise'],
        min: [1900, 'L\'année doit être supérieure à 1900'],
        max: [new Date().getFullYear() + 1, 'L\'année ne peut pas être dans le futur']
    },
    category: {
        type: String,
        required: [true, 'La catégorie est requise'],
        enum: {
            values: ['citadine', 'berline', 'break', 'suv', 'utilitaire', 'moto', 'camion'],
            message: 'Catégorie invalide'
        }
    },
    fuel_type: {
        type: String,
        required: [true, 'Le type de carburant est requis'],
        enum: {
            values: ['essence', 'diesel', 'hybride', 'électrique', 'gpl'],
            message: 'Type de carburant invalide'
        }
    },
    transmission: {
        type: String,
        required: [true, 'Le type de transmission est requis'],
        enum: {
            values: ['manuelle', 'automatique'],
            message: 'Type de transmission invalide'
        }
    },
    km: {
        type: Number,
        required: [true, 'Le kilométrage est requis'],
        min: [0, 'Le kilométrage ne peut pas être négatif'],
        max: [1000000, 'Le kilométrage semble invalide']
    },
    daily_rate: {
        type: Number,
        required: [true, 'Le tarif journalier est requis'],
        min: [0, 'Le tarif journalier ne peut pas être négatif']
    },
    is_available: {
        type: Boolean,
        default: true
    },
    is_maintenance: {
        type: Boolean,
        default: false
    },
    last_maintenance: {
        type: Date
    },
    next_maintenance: {
        type: Date
    },
    features: [{
        type: String,
        trim: true
    }],
    images: [{
        url: String,
        alt: String
    }]
}, {
    timestamps: true,
    collection: 'vehicles'
});

// Index pour améliorer les performances
vehicleSchema.index({ licence_plate: 1 });
vehicleSchema.index({ category: 1 });
vehicleSchema.index({ is_available: 1 });
vehicleSchema.index({ km: 1 });

// Méthode statique pour rechercher des véhicules disponibles
vehicleSchema.statics.findAvailable = function() {
    return this.find({ 
        is_available: true, 
        is_maintenance: false 
    });
};

// Méthode statique pour rechercher par catégorie
vehicleSchema.statics.findByCategory = function(category) {
    return this.find({ 
        category: category,
        is_available: true 
    });
};

// Méthode statique pour rechercher par kilométrage maximum
vehicleSchema.statics.findByMaxKm = function(maxKm) {
    return this.find({ 
        km: { $lte: maxKm },
        is_available: true 
    });
};

// Méthode d'instance pour calculer l'âge du véhicule
vehicleSchema.methods.getAge = function() {
    return new Date().getFullYear() - this.year;
};

// Méthode d'instance pour vérifier si une maintenance est nécessaire
vehicleSchema.methods.needsMaintenance = function() {
    if (!this.next_maintenance) return false;
    return new Date() >= this.next_maintenance;
};

// Middleware pre-save pour mettre à jour la date de prochaine maintenance
vehicleSchema.pre('save', function(next) {
    if (this.isModified('km') && this.km % 10000 === 0) {
        this.next_maintenance = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // +30 jours
    }
    next();
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;
