const Customer = require('../models/customerModel');

class CustomerRepository {
    
    /**
     * Créer un nouveau client
     * @param {Object} customerData - Données du client
     * @returns {Promise<Object>} Client créé
     */
    async create(customerData) {
        try {
            const customer = new Customer(customerData);
            return await customer.save();
        } catch (error) {
            throw new Error(`Erreur lors de la création du client: ${error.message}`);
        }
    }

    /**
     * Récupérer un client par son ID
     * @param {string} id - ID du client
     * @returns {Promise<Object|null>} Client trouvé ou null
     */
    async findById(id) {
        try {
            return await Customer.findById(id);
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du client: ${error.message}`);
        }
    }

    /**
     * Récupérer tous les clients avec pagination
     * @param {Object} options - Options de pagination et filtres
     * @returns {Promise<Object>} Liste des clients et métadonnées
     */
    async findAll(options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                sort = { createdAt: -1 },
                filter = {}
            } = options;

            const skip = (page - 1) * limit;
            
            const [customers, total] = await Promise.all([
                Customer.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .select('-__v'),
                Customer.countDocuments(filter)
            ]);

            return {
                customers,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                    hasNext: page * limit < total,
                    hasPrev: page > 1
                }
            };
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des clients: ${error.message}`);
        }
    }

    /**
     * Rechercher un client par nom complet
     * @param {string} firstname - Prénom
     * @param {string} lastname - Nom
     * @returns {Promise<Object|null>} Client trouvé ou null
     */
    async findByFullName(firstname, lastname) {
        try {
            return await Customer.findByFullName(firstname, lastname);
        } catch (error) {
            throw new Error(`Erreur lors de la recherche par nom: ${error.message}`);
        }
    }

    /**
     * Rechercher un client par numéro de permis
     * @param {string} permitNumber - Numéro de permis
     * @returns {Promise<Object|null>} Client trouvé ou null
     */
    async findByPermitNumber(permitNumber) {
        try {
            return await Customer.findOne({ permit_number: permitNumber.toUpperCase() });
        } catch (error) {
            throw new Error(`Erreur lors de la recherche par permis: ${error.message}`);
        }
    }

    /**
     * Rechercher un client par email
     * @param {string} email - Email du client
     * @returns {Promise<Object|null>} Client trouvé ou null
     */
    async findByEmail(email) {
        try {
            return await Customer.findOne({ email: email.toLowerCase() });
        } catch (error) {
            throw new Error(`Erreur lors de la recherche par email: ${error.message}`);
        }
    }

    /**
     * Mettre à jour un client
     * @param {string} id - ID du client
     * @param {Object} updateData - Données à mettre à jour
     * @returns {Promise<Object|null>} Client mis à jour ou null
     */
    async update(id, updateData) {
        try {
            return await Customer.findByIdAndUpdate(
                id,
                updateData,
                { 
                    new: true, 
                    runValidators: true,
                    select: '-__v'
                }
            );
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du client: ${error.message}`);
        }
    }

    /**
     * Supprimer un client (soft delete)
     * @param {string} id - ID du client
     * @returns {Promise<Object|null>} Client supprimé ou null
     */
    async delete(id) {
        try {
            return await Customer.findByIdAndUpdate(
                id,
                { is_active: false },
                { new: true, select: '-__v' }
            );
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du client: ${error.message}`);
        }
    }

    /**
     * Supprimer définitivement un client
     * @param {string} id - ID du client
     * @returns {Promise<Object|null>} Client supprimé ou null
     */
    async hardDelete(id) {
        try {
            return await Customer.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Erreur lors de la suppression définitive du client: ${error.message}`);
        }
    }

    /**
     * Restaurer un client supprimé
     * @param {string} id - ID du client
     * @returns {Promise<Object|null>} Client restauré ou null
     */
    async restore(id) {
        try {
            return await Customer.findByIdAndUpdate(
                id,
                { is_active: true },
                { new: true, select: '-__v' }
            );
        } catch (error) {
            throw new Error(`Erreur lors de la restauration du client: ${error.message}`);
        }
    }

    /**
     * Rechercher des clients avec filtres avancés
     * @param {Object} filters - Filtres de recherche
     * @returns {Promise<Array>} Liste des clients correspondants
     */
    async search(filters = {}) {
        try {
            const query = {};

            if (filters.firstname) {
                query.firstname = { $regex: new RegExp(filters.firstname, 'i') };
            }

            if (filters.lastname) {
                query.lastname = { $regex: new RegExp(filters.lastname, 'i') };
            }

            if (filters.address) {
                query.address = { $regex: new RegExp(filters.address, 'i') };
            }

            if (filters.is_active !== undefined) {
                query.is_active = filters.is_active;
            }

            if (filters.birth_date_from || filters.birth_date_to) {
                query.birth_date = {};
                if (filters.birth_date_from) {
                    query.birth_date.$gte = new Date(filters.birth_date_from);
                }
                if (filters.birth_date_to) {
                    query.birth_date.$lte = new Date(filters.birth_date_to);
                }
            }

            return await Customer.find(query)
                .sort({ createdAt: -1 })
                .select('-__v');
        } catch (error) {
            throw new Error(`Erreur lors de la recherche avancée: ${error.message}`);
        }
    }

    /**
     * Obtenir des statistiques sur les clients
     * @returns {Promise<Object>} Statistiques des clients
     */
    async getStats() {
        try {
            const [total, active, inactive] = await Promise.all([
                Customer.countDocuments(),
                Customer.countDocuments({ is_active: true }),
                Customer.countDocuments({ is_active: false })
            ]);

            return {
                total,
                active,
                inactive,
                activePercentage: total > 0 ? Math.round((active / total) * 100) : 0
            };
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
        }
    }
}

module.exports = CustomerRepository;
