const vehicleService = require('../services/vehicleService');

// Obtenir tous les véhicules avec pagination et filtres
const getAllVehicles = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Filtres
        const filters = {};
        if (req.query.category) filters.category = req.query.category;
        if (req.query.fuel_type) filters.fuel_type = req.query.fuel_type;
        if (req.query.transmission) filters.transmission = req.query.transmission;
        if (req.query.is_available !== undefined) filters.is_available = req.query.is_available === 'true';
        if (req.query.is_maintenance !== undefined) filters.is_maintenance = req.query.is_maintenance === 'true';
        if (req.query.min_price) filters.daily_rate = { $gte: parseFloat(req.query.min_price) };
        if (req.query.max_price) {
            if (filters.daily_rate) {
                filters.daily_rate.$lte = parseFloat(req.query.max_price);
            } else {
                filters.daily_rate = { $lte: parseFloat(req.query.max_price) };
            }
        }

        // Tri
        const sort = {};
        if (req.query.sort) {
            const [field, order] = req.query.sort.split(':');
            sort[field] = order === 'desc' ? -1 : 1;
        } else {
            sort.createdAt = -1;
        }

        const pagination = { page, limit, sort };
        const result = await vehicleService.getAllVehicles(filters, pagination);

        res.status(200).json({
            success: true,
            data: result.vehicles,
            pagination: result.pagination
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des véhicules',
            error: error.message
        });
    }
};

// Obtenir un véhicule par ID
const getVehicleById = async (req, res) => {
    try {
        const vehicle = await vehicleService.getVehicleById(req.params.id);
        
        res.status(200).json({
            success: true,
            data: vehicle
        });
    } catch (error) {
        if (error.message === 'Véhicule non trouvé') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération du véhicule',
            error: error.message
        });
    }
};

// Créer un nouveau véhicule
const createVehicle = async (req, res) => {
    try {
        const vehicle = await vehicleService.createVehicle(req.body);

        res.status(201).json({
            success: true,
            message: 'Véhicule créé avec succès',
            data: vehicle
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la création du véhicule',
            error: error.message
        });
    }
};

// Mettre à jour un véhicule
const updateVehicle = async (req, res) => {
    try {
        const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: 'Véhicule mis à jour avec succès',
            data: vehicle
        });
    } catch (error) {
        if (error.message === 'Véhicule non trouvé') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        res.status(400).json({
            success: false,
            message: 'Erreur lors de la mise à jour du véhicule',
            error: error.message
        });
    }
};

// Supprimer un véhicule
const deleteVehicle = async (req, res) => {
    try {
        await vehicleService.deleteVehicle(req.params.id);

        res.status(200).json({
            success: true,
            message: 'Véhicule supprimé avec succès'
        });
    } catch (error) {
        if (error.message === 'Véhicule non trouvé') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la suppression du véhicule',
            error: error.message
        });
    }
};

// Obtenir les véhicules disponibles
const getAvailableVehicles = async (req, res) => {
    try {
        const vehicles = await vehicleService.getAvailableVehicles();
        
        res.status(200).json({
            success: true,
            data: vehicles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des véhicules disponibles',
            error: error.message
        });
    }
};

// Obtenir les véhicules par catégorie
const getVehiclesByCategory = async (req, res) => {
    try {
        const { category } = req.params;
        const vehicles = await vehicleService.getVehiclesByCategory(category);
        
        res.status(200).json({
            success: true,
            data: vehicles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des véhicules par catégorie',
            error: error.message
        });
    }
};

// Rechercher des véhicules
const searchVehicles = async (req, res) => {
    try {
        const { q } = req.query;
        
        if (!q) {
            return res.status(400).json({
                success: false,
                message: 'Le paramètre de recherche est requis'
            });
        }

        const vehicles = await vehicleService.searchVehicles(q);

        res.status(200).json({
            success: true,
            data: vehicles
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la recherche de véhicules',
            error: error.message
        });
    }
};

// Mettre un véhicule en maintenance
const setVehicleMaintenance = async (req, res) => {
    try {
        const vehicle = await vehicleService.setVehicleMaintenance(req.params.id, req.body);

        res.status(200).json({
            success: true,
            message: `Véhicule ${req.body.is_maintenance ? 'mis en maintenance' : 'retiré de la maintenance'}`,
            data: vehicle
        });
    } catch (error) {
        if (error.message === 'Véhicule non trouvé') {
            return res.status(404).json({
                success: false,
                message: error.message
            });
        }
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la mise à jour du statut de maintenance',
            error: error.message
        });
    }
};

// Obtenir les statistiques des véhicules
const getVehicleStats = async (req, res) => {
    try {
        const stats = await vehicleService.getVehicleStats();

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Erreur lors de la récupération des statistiques',
            error: error.message
        });
    }
};

module.exports = {
    getAllVehicles,
    getVehicleById,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    getAvailableVehicles,
    getVehiclesByCategory,
    searchVehicles,
    setVehicleMaintenance,
    getVehicleStats
};
