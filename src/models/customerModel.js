const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({
    firstname: {
        type: String,
        required: [true, 'Le prénom est requis'],
        trim: true,
        minlength: [2, 'Le prénom doit contenir au moins 2 caractères'],
        maxlength: [50, 'Le prénom ne peut pas dépasser 50 caractères']
    },
    lastname: {
        type: String,
        required: [true, 'Le nom est requis'],
        trim: true,
        minlength: [2, 'Le nom doit contenir au moins 2 caractères'],
        maxlength: [50, 'Le nom ne peut pas dépasser 50 caractères']
    },
    address: {
        type: String,
        required: [true, 'L\'adresse est requise'],
        trim: true,
        maxlength: [200, 'L\'adresse ne peut pas dépasser 200 caractères']
    },
    permit_number: {
        type: String,
        required: [true, 'Le numéro de permis est requis'],
        unique: true,
        trim: true,
        match: [/^[A-Z0-9]{12}$/, 'Le numéro de permis doit contenir 12 caractères alphanumériques']
    },
    email: {
        type: String,
        required: [true, 'L\'email est requis'],
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Format d\'email invalide']
    },
    phone: {
        type: String,
        trim: true,
        match: [/^(\+33|0)[1-9](\d{8})$/, 'Format de téléphone invalide']
    },
    birth_date: {
        type: Date,
        required: [true, 'La date de naissance est requise'],
        validate: {
            validator: function(v) {
                const age = (new Date() - v) / (1000 * 60 * 60 * 24 * 365.25);
                return age >= 18;
            },
            message: 'Le client doit être majeur (18 ans minimum)'
        }
    },
    is_active: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
    collection: 'customers'
});

// Index pour améliorer les performances
customerSchema.index({ firstname: 1, lastname: 1 });
customerSchema.index({ permit_number: 1 });
customerSchema.index({ email: 1 });

// Méthode statique pour rechercher par nom complet
customerSchema.statics.findByFullName = function(firstname, lastname) {
    return this.findOne({
        firstname: { $regex: new RegExp(firstname, 'i') },
        lastname: { $regex: new RegExp(lastname, 'i') }
    });
};

// Méthode d'instance pour obtenir le nom complet
customerSchema.methods.getFullName = function() {
    return `${this.firstname} ${this.lastname}`;
};

// Middleware pre-save pour valider le permis
customerSchema.pre('save', function(next) {
    if (this.isModified('permit_number')) {
        this.permit_number = this.permit_number.toUpperCase();
    }
    next();
});

const Customer = mongoose.model('Customer', customerSchema);

module.exports = Customer;
