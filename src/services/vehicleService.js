const Vehicle = require('../models/vehicleModel');
const VehicleRepository = require('../repositories/vehicleRepository');

class VehicleService {
    constructor() {
        this.vehicleRepository = new VehicleRepository();
    }
    // Méthodes de base CRUD
    async getAllVehicles(filters = {}, pagination = {}) {
        try {
            return await this.vehicleRepository.findAll(filters, pagination);
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des véhicules: ${error.message}`);
        }
    }

    async getVehicleById(id) {
        try {
            const vehicle = await this.vehicleRepository.findById(id);
            if (!vehicle) {
                throw new Error('Véhicule non trouvé');
            }
            return vehicle;
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du véhicule: ${error.message}`);
        }
    }

    async createVehicle(vehicleData) {
        try {
            // Validation métier avant création
            await this.validateVehicleData(vehicleData);
            
            // Vérification de l'unicité de la plaque d'immatriculation
            const existingVehicle = await this.vehicleRepository.findByLicencePlate(vehicleData.licence_plate);
            if (existingVehicle) {
                throw new Error('Un véhicule avec cette plaque d\'immatriculation existe déjà');
            }

            return await this.vehicleRepository.create(vehicleData);
        } catch (error) {
            throw new Error(`Erreur lors de la création du véhicule: ${error.message}`);
        }
    }

    async updateVehicle(id, updateData) {
        try {
            // Validation métier avant mise à jour
            await this.validateVehicleData(updateData, true);
            
            // Vérification de l'existence du véhicule
            const existingVehicle = await this.vehicleRepository.findById(id);
            if (!existingVehicle) {
                throw new Error('Véhicule non trouvé');
            }

            // Vérification de l'unicité de la plaque si elle est modifiée
            if (updateData.licence_plate && updateData.licence_plate !== existingVehicle.licence_plate) {
                const vehicleWithSamePlate = await this.vehicleRepository.findByLicencePlate(updateData.licence_plate);
                if (vehicleWithSamePlate) {
                    throw new Error('Un véhicule avec cette plaque d\'immatriculation existe déjà');
                }
            }

            return await this.vehicleRepository.update(id, updateData);
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du véhicule: ${error.message}`);
        }
    }

    async deleteVehicle(id) {
        try {
            const vehicle = await this.vehicleRepository.findById(id);
            if (!vehicle) {
                throw new Error('Véhicule non trouvé');
            }

            // Vérifications métier avant suppression
            if (!vehicle.is_available) {
                throw new Error('Impossible de supprimer un véhicule qui n\'est pas disponible');
            }

            return await this.vehicleRepository.delete(id);
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du véhicule: ${error.message}`);
        }
    }

    // Méthodes métier spécialisées
    async getAvailableVehicles(filters = {}) {
        try {
            return await this.vehicleRepository.findAvailable(filters);
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des véhicules disponibles: ${error.message}`);
        }
    }

    async getVehiclesByCategory(category, filters = {}) {
        try {
            if (!category) {
                throw new Error('La catégorie est requise');
            }
            return await this.vehicleRepository.findByCategory(category, filters);
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des véhicules par catégorie: ${error.message}`);
        }
    }

    async searchVehicles(searchTerm, filters = {}) {
        try {
            if (!searchTerm || searchTerm.trim().length < 2) {
                throw new Error('Le terme de recherche doit contenir au moins 2 caractères');
            }
            return await this.vehicleRepository.search(searchTerm, filters);
        } catch (error) {
            throw new Error(`Erreur lors de la recherche de véhicules: ${error.message}`);
        }
    }

    async setVehicleMaintenance(id, maintenanceData) {
        try {
            const vehicle = await this.vehicleRepository.findById(id);
            if (!vehicle) {
                throw new Error('Véhicule non trouvé');
            }

            const { is_maintenance, maintenance_notes } = maintenanceData;
            
            // Logique métier pour la maintenance
            const updateData = {
                is_maintenance: is_maintenance,
                last_maintenance: is_maintenance ? new Date() : undefined,
                next_maintenance: is_maintenance ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : undefined
            };

            // Si le véhicule est mis en maintenance, il devient indisponible
            if (is_maintenance) {
                updateData.is_available = false;
            }

            return await this.vehicleRepository.update(id, updateData);
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du statut de maintenance: ${error.message}`);
        }
    }

    async getVehicleStats() {
        try {
            return await this.vehicleRepository.getStats();
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
        }
    }

    async getVehiclesByPriceRange(minPrice, maxPrice, filters = {}) {
        try {
            if (minPrice && maxPrice && minPrice > maxPrice) {
                throw new Error('Le prix minimum ne peut pas être supérieur au prix maximum');
            }
            return await this.vehicleRepository.findByPriceRange(minPrice, maxPrice, filters);
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des véhicules par gamme de prix: ${error.message}`);
        }
    }

    async getVehiclesByFuelType(fuelType, filters = {}) {
        try {
            if (!fuelType) {
                throw new Error('Le type de carburant est requis');
            }
            return await this.vehicleRepository.findByFuelType(fuelType, filters);
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des véhicules par type de carburant: ${error.message}`);
        }
    }

    async getVehiclesByTransmission(transmission, filters = {}) {
        try {
            if (!transmission) {
                throw new Error('Le type de transmission est requis');
            }
            return await this.vehicleRepository.findByTransmission(transmission, filters);
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des véhicules par type de transmission: ${error.message}`);
        }
    }

    // Méthodes de validation métier
    async validateVehicleData(vehicleData, isUpdate = false) {
        const errors = [];

        // Validation de la plaque d'immatriculation
        if (!isUpdate || vehicleData.licence_plate) {
            const plateRegex = /^[A-Z]{2}-[0-9]{3}-[A-Z]{2}$/;
            if (!plateRegex.test(vehicleData.licence_plate)) {
                errors.push('Format de plaque invalide (ex: AB-123-CD)');
            }
        }

        // Validation de l'année
        if (!isUpdate || vehicleData.year) {
            const currentYear = new Date().getFullYear();
            if (vehicleData.year < 1900 || vehicleData.year > currentYear + 1) {
                errors.push(`L'année doit être comprise entre 1900 et ${currentYear + 1}`);
            }
        }

        // Validation du kilométrage
        if (!isUpdate || vehicleData.km !== undefined) {
            if (vehicleData.km < 0 || vehicleData.km > 1000000) {
                errors.push('Le kilométrage doit être compris entre 0 et 1 000 000 km');
            }
        }

        // Validation du tarif journalier
        if (!isUpdate || vehicleData.daily_rate !== undefined) {
            if (vehicleData.daily_rate < 0) {
                errors.push('Le tarif journalier ne peut pas être négatif');
            }
        }

        // Validation des catégories et types
        const validCategories = ['citadine', 'berline', 'break', 'suv', 'utilitaire', 'moto', 'camion'];
        const validFuelTypes = ['essence', 'diesel', 'hybride', 'électrique', 'gpl'];
        const validTransmissions = ['manuelle', 'automatique'];

        if (!isUpdate || vehicleData.category) {
            if (!validCategories.includes(vehicleData.category)) {
                errors.push(`Catégorie invalide. Valeurs autorisées: ${validCategories.join(', ')}`);
            }
        }

        if (!isUpdate || vehicleData.fuel_type) {
            if (!validFuelTypes.includes(vehicleData.fuel_type)) {
                errors.push(`Type de carburant invalide. Valeurs autorisées: ${validFuelTypes.join(', ')}`);
            }
        }

        if (!isUpdate || vehicleData.transmission) {
            if (!validTransmissions.includes(vehicleData.transmission)) {
                errors.push(`Type de transmission invalide. Valeurs autorisées: ${validTransmissions.join(', ')}`);
            }
        }

        if (errors.length > 0) {
            throw new Error(`Erreurs de validation: ${errors.join('; ')}`);
        }
    }

    // Méthodes utilitaires
    async getVehicleAge(id) {
        try {
            const vehicle = await this.getVehicleById(id);
            return new Date().getFullYear() - vehicle.year;
        } catch (error) {
            throw new Error(`Erreur lors du calcul de l'âge du véhicule: ${error.message}`);
        }
    }

    async checkMaintenanceNeeded(id) {
        try {
            const vehicle = await this.getVehicleById(id);
            if (!vehicle.next_maintenance) return false;
            return new Date() >= vehicle.next_maintenance;
        } catch (error) {
            throw new Error(`Erreur lors de la vérification de la maintenance: ${error.message}`);
        }
    }

    async getVehiclesNeedingMaintenance() {
        try {
            return await vehicleRepository.findNeedingMaintenance();
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des véhicules nécessitant une maintenance: ${error.message}`);
        }
    }
}

module.exports = new VehicleService();
