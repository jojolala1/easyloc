const express = require('express');
const CustomerController = require('../controllers/customerController');

const router = express.Router();
const customerController = new CustomerController();

/**
 * @route   POST /api/customers
 * @desc    Créer un nouveau client
 * @access  Public
 */
router.post('/', customerController.createCustomer.bind(customerController));

/**
 * @route   GET /api/customers
 * @desc    Récupérer tous les clients avec pagination
 * @access  Public
 */
router.get('/', customerController.getAllCustomers.bind(customerController));

/**
 * @route   GET /api/customers/search
 * @desc    Rechercher des clients avec filtres avancés
 * @access  Public
 */
router.get('/search', customerController.searchCustomers.bind(customerController));

/**
 * @route   GET /api/customers/search/name
 * @desc    Rechercher un client par nom complet
 * @access  Public
 */
router.get('/search/name', customerController.findCustomerByFullName.bind(customerController));

/**
 * @route   GET /api/customers/stats
 * @desc    Obtenir des statistiques sur les clients
 * @access  Public
 */
router.get('/stats', customerController.getCustomerStats.bind(customerController));

/**
 * @route   GET /api/customers/:id
 * @desc    Récupérer un client par son ID
 * @access  Public
 */
router.get('/:id', customerController.getCustomerById.bind(customerController));

/**
 * @route   GET /api/customers/permit/:permitNumber
 * @desc    Rechercher un client par numéro de permis
 * @access  Public
 */
router.get('/permit/:permitNumber', customerController.findCustomerByPermitNumber.bind(customerController));

/**
 * @route   PUT /api/customers/:id
 * @desc    Mettre à jour un client
 * @access  Public
 */
router.put('/:id', customerController.updateCustomer.bind(customerController));

/**
 * @route   DELETE /api/customers/:id
 * @desc    Supprimer un client (soft delete)
 * @access  Public
 */
router.delete('/:id', customerController.deleteCustomer.bind(customerController));

/**
 * @route   PATCH /api/customers/:id/restore
 * @desc    Restaurer un client supprimé
 * @access  Public
 */
router.patch('/:id/restore', customerController.restoreCustomer.bind(customerController));

module.exports = router;
