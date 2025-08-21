const express = require('express');
const router = express.Router();
const {
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
} = require('../controllers/vehicleController');

// Routes principales CRUD
router.get('/', getAllVehicles);                    // GET /api/vehicles - Liste tous les véhicules
router.get('/available', getAvailableVehicles);     // GET /api/vehicles/available - Véhicules disponibles
router.get('/search', searchVehicles);              // GET /api/vehicles/search?q=terme - Recherche de véhicules
router.get('/category/:category', getVehiclesByCategory); // GET /api/vehicles/category/citadine - Par catégorie
router.get('/stats', getVehicleStats);              // GET /api/vehicles/stats - Statistiques
router.get('/:id', getVehicleById);                 // GET /api/vehicles/:id - Véhicule par ID

router.post('/', createVehicle);                    // POST /api/vehicles - Créer un véhicule
router.put('/:id', updateVehicle);                  // PUT /api/vehicles/:id - Mettre à jour un véhicule
router.delete('/:id', deleteVehicle);               // DELETE /api/vehicles/:id - Supprimer un véhicule

// Routes spécialisées
router.patch('/:id/maintenance', setVehicleMaintenance); // PATCH /api/vehicles/:id/maintenance - Gestion maintenance

module.exports = router;
