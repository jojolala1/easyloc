const Vehicle = require('../models/vehicleModel');

class VehicleRepository {
    
    /**
     * Créer un nouveau véhicule
     * @param {Object} vehicleData - Données du véhicule
     * @returns {Promise<Object>} Véhicule créé
     */
    async create(vehicleData) {
        try {
            const vehicle = new Vehicle(vehicleData);
            return await vehicle.save();
        } catch (error) {
            throw new Error(`Erreur lors de la création du véhicule: ${error.message}`);
        }
    }

    /**
     * Récupérer un véhicule par son ID
     * @param {string} id - ID du véhicule
     * @returns {Promise<Object|null>} Véhicule trouvé ou null
     */
    async findById(id) {
        try {
            return await Vehicle.findById(id);
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du véhicule: ${error.message}`);
        }
    }

    /**
     * Récupérer un véhicule par sa plaque d'immatriculation
     * @param {string} licencePlate - Plaque d'immatriculation
     * @returns {Promise<Object|null>} Véhicule trouvé ou null
     */
    async findByLicencePlate(licencePlate) {
        try {
            return await Vehicle.findOne({ licence_plate: licencePlate.toUpperCase() });
        } catch (error) {
            throw new Error(`Erreur lors de la recherche par plaque: ${error.message}`);
        }
    }

    /**
     * Récupérer tous les véhicules avec pagination et filtres
     * @param {Object} options - Options de pagination et filtres
     * @returns {Promise<Object>} Liste des véhicules et métadonnées
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
            
            const [vehicles, total] = await Promise.all([
                Vehicle.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(limit)
                    .select('-__v'),
                Vehicle.countDocuments(filter)
            ]);

            return {
                vehicles,
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
            throw new Error(`Erreur lors de la récupération des véhicules: ${error.message}`);
        }
    }

    /**
     * Récupérer tous les véhicules disponibles
     * @param {Object} options - Options de pagination et filtres
     * @returns {Promise<Object>} Liste des véhicules disponibles
     */
    async findAvailable(options = {}) {
        try {
            const filter = { ...options.filter, is_available: true, is_maintenance: false };
            return await this.findAll({ ...options, filter });
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des véhicules disponibles: ${error.message}`);
        }
    }

    /**
     * Rechercher des véhicules par catégorie
     * @param {string} category - Catégorie du véhicule
     * @param {Object} options - Options de pagination
     * @returns {Promise<Object>} Liste des véhicules de la catégorie
     */
    async findByCategory(category, options = {}) {
        try {
            const filter = { ...options.filter, category, is_available: true };
            return await this.findAll({ ...options, filter });
        } catch (error) {
            throw new Error(`Erreur lors de la recherche par catégorie: ${error.message}`);
        }
    }

    /**
     * Rechercher des véhicules par type de carburant
     * @param {string} fuelType - Type de carburant
     * @param {Object} options - Options de pagination
     * @returns {Promise<Object>} Liste des véhicules du type de carburant
     */
    async findByFuelType(fuelType, options = {}) {
        try {
            const filter = { ...options.filter, fuel_type: fuelType, is_available: true };
            return await this.findAll({ ...options, filter });
        } catch (error) {
            throw new Error(`Erreur lors de la recherche par type de carburant: ${error.message}`);
        }
    }

    /**
     * Rechercher des véhicules par kilométrage maximum
     * @param {number} maxKm - Kilométrage maximum
     * @param {Object} options - Options de pagination
     * @returns {Promise<Object>} Liste des véhicules sous le kilométrage
     */
    async findByMaxKm(maxKm, options = {}) {
        try {
            const filter = { ...options.filter, km: { $lte: maxKm }, is_available: true };
            return await this.findAll({ ...options, filter });
        } catch (error) {
            throw new Error(`Erreur lors de la recherche par kilométrage: ${error.message}`);
        }
    }

    /**
     * Rechercher des véhicules par fourchette de prix
     * @param {number} minPrice - Prix minimum
     * @param {number} maxPrice - Prix maximum
     * @param {Object} options - Options de pagination
     * @returns {Promise<Object>} Liste des véhicules dans la fourchette de prix
     */
    async findByPriceRange(minPrice, maxPrice, options = {}) {
        try {
            const filter = { 
                ...options.filter, 
                daily_rate: { $gte: minPrice, $lte: maxPrice },
                is_available: true 
            };
            return await this.findAll({ ...options, filter });
        } catch (error) {
            throw new Error(`Erreur lors de la recherche par fourchette de prix: ${error.message}`);
        }
    }

    /**
     * Mettre à jour un véhicule
     * @param {string} id - ID du véhicule
     * @param {Object} updateData - Données à mettre à jour
     * @returns {Promise<Object|null>} Véhicule mis à jour ou null
     */
    async update(id, updateData) {
        try {
            return await Vehicle.findByIdAndUpdate(
                id,
                updateData,
                { 
                    new: true, 
                    runValidators: true,
                    select: '-__v'
                }
            );
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du véhicule: ${error.message}`);
        }
    }

    /**
     * Mettre à jour le kilométrage d'un véhicule
     * @param {string} id - ID du véhicule
     * @param {number} newKm - Nouveau kilométrage
     * @returns {Promise<Object|null>} Véhicule mis à jour ou null
     */
    async updateKilometerage(id, newKm) {
        try {
            return await Vehicle.findByIdAndUpdate(
                id,
                { km: newKm },
                { 
                    new: true, 
                    runValidators: true,
                    select: '-__v'
                }
            );
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du kilométrage: ${error.message}`);
        }
    }

    /**
     * Marquer un véhicule comme indisponible
     * @param {string} id - ID du véhicule
     * @returns {Promise<Object|null>} Véhicule mis à jour ou null
     */
    async setUnavailable(id) {
        try {
            return await Vehicle.findByIdAndUpdate(
                id,
                { is_available: false },
                { new: true, select: '-__v' }
            );
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour de la disponibilité: ${error.message}`);
        }
    }

    /**
     * Marquer un véhicule comme disponible
     * @param {string} id - ID du véhicule
     * @returns {Promise<Object|null>} Véhicule mis à jour ou null
     */
    async setAvailable(id) {
        try {
            return await Vehicle.findByIdAndUpdate(
                id,
                { is_available: true },
                { new: true, select: '-__v' }
            );
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour de la disponibilité: ${error.message}`);
        }
    }

    /**
     * Marquer un véhicule en maintenance
     * @param {string} id - ID du véhicule
     * @param {Date} nextMaintenance - Date de prochaine maintenance
     * @returns {Promise<Object|null>} Véhicule mis à jour ou null
     */
    async setMaintenance(id, nextMaintenance = null) {
        try {
            const updateData = { 
                is_maintenance: true, 
                is_available: false,
                last_maintenance: new Date()
            };
            
            if (nextMaintenance) {
                updateData.next_maintenance = nextMaintenance;
            }

            return await Vehicle.findByIdAndUpdate(
                id,
                updateData,
                { new: true, select: '-__v' }
            );
        } catch (error) {
            throw new Error(`Erreur lors de la mise en maintenance: ${error.message}`);
        }
    }

    /**
     * Terminer la maintenance d'un véhicule
     * @param {string} id - ID du véhicule
     * @returns {Promise<Object|null>} Véhicule mis à jour ou null
     */
    async endMaintenance(id) {
        try {
            return await Vehicle.findByIdAndUpdate(
                id,
                { 
                    is_maintenance: false, 
                    is_available: true,
                    last_maintenance: new Date()
                },
                { new: true, select: '-__v' }
            );
        } catch (error) {
            throw new Error(`Erreur lors de la fin de maintenance: ${error.message}`);
        }
    }

    /**
     * Supprimer un véhicule (soft delete)
     * @param {string} id - ID du véhicule
     * @returns {Promise<Object|null>} Véhicule supprimé ou null
     */
    async delete(id) {
        try {
            return await Vehicle.findByIdAndUpdate(
                id,
                { is_available: false },
                { new: true, select: '-__v' }
            );
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du véhicule: ${error.message}`);
        }
    }

    /**
     * Supprimer définitivement un véhicule
     * @param {string} id - ID du véhicule
     * @returns {Promise<Object|null>} Véhicule supprimé ou null
     */
    async hardDelete(id) {
        try {
            return await Vehicle.findByIdAndDelete(id);
        } catch (error) {
            throw new Error(`Erreur lors de la suppression définitive du véhicule: ${error.message}`);
        }
    }

    /**
     * Rechercher des véhicules avec filtres avancés
     * @param {Object} filters - Filtres de recherche
     * @returns {Promise<Array>} Liste des véhicules correspondants
     */
    async search(filters = {}) {
        try {
            const query = {};

            if (filters.brand) {
                query.brand = { $regex: new RegExp(filters.brand, 'i') };
            }

            if (filters.model) {
                query.model = { $regex: new RegExp(filters.model, 'i') };
            }

            if (filters.category) {
                query.category = filters.category;
            }

            if (filters.fuel_type) {
                query.fuel_type = filters.fuel_type;
            }

            if (filters.transmission) {
                query.transmission = filters.transmission;
            }

            if (filters.year_from || filters.year_to) {
                query.year = {};
                if (filters.year_from) {
                    query.year.$gte = parseInt(filters.year_from);
                }
                if (filters.year_to) {
                    query.year.$lte = parseInt(filters.year_to);
                }
            }

            if (filters.price_from || filters.price_to) {
                query.daily_rate = {};
                if (filters.price_from) {
                    query.daily_rate.$gte = parseFloat(filters.price_from);
                }
                if (filters.price_to) {
                    query.daily_rate.$lte = parseFloat(filters.price_to);
                }
            }

            if (filters.is_available !== undefined) {
                query.is_available = filters.is_available;
            }

            if (filters.is_maintenance !== undefined) {
                query.is_maintenance = filters.is_maintenance;
            }

            return await Vehicle.find(query)
                .sort({ createdAt: -1 })
                .select('-__v');
        } catch (error) {
            throw new Error(`Erreur lors de la recherche avancée: ${error.message}`);
        }
    }

    /**
     * Obtenir des statistiques sur les véhicules
     * @returns {Promise<Object>} Statistiques des véhicules
     */
    async getStats() {
        try {
            const [total, available, maintenance, unavailable] = await Promise.all([
                Vehicle.countDocuments(),
                Vehicle.countDocuments({ is_available: true, is_maintenance: false }),
                Vehicle.countDocuments({ is_maintenance: true }),
                Vehicle.countDocuments({ is_available: false, is_maintenance: false })
            ]);

            return {
                total,
                available,
                maintenance,
                unavailable,
                availablePercentage: total > 0 ? Math.round((available / total) * 100) : 0
            };
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
        }
    }
}

module.exports = VehicleRepository;
