const CustomerService = require('../services/customerService');

class CustomerController {
    constructor() {
        this.customerService = new CustomerService();
    }

    /**
     * Créer un nouveau client
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async createCustomer(req, res) {
        try {
            const result = await this.customerService.createCustomer(req.body);
            
            res.status(201).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Récupérer un client par son ID
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async getCustomerById(req, res) {
        try {
            const { id } = req.params;
            const result = await this.customerService.getCustomerById(id);
            
            res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Récupérer tous les clients avec pagination
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async getAllCustomers(req, res) {
        try {
            const { page, limit, sort, filter } = req.query;
            
            const options = {
                page: parseInt(page) || 1,
                limit: parseInt(limit) || 10,
                sort: sort ? JSON.parse(sort) : { createdAt: -1 },
                filter: filter ? JSON.parse(filter) : {}
            };

            const result = await this.customerService.getAllCustomers(options);
            
            res.status(200).json({
                success: true,
                data: result.data,
                pagination: result.pagination
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Rechercher un client par nom complet
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async findCustomerByFullName(req, res) {
        try {
            const { firstname, lastname } = req.query;
            
            if (!firstname || !lastname) {
                return res.status(400).json({
                    success: false,
                    message: 'Les paramètres firstname et lastname sont requis'
                });
            }

            const result = await this.customerService.findCustomerByFullName(firstname, lastname);
            
            res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Rechercher un client par numéro de permis
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async findCustomerByPermitNumber(req, res) {
        try {
            const { permitNumber } = req.params;
            const result = await this.customerService.findCustomerByPermitNumber(permitNumber);
            
            res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Mettre à jour un client
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async updateCustomer(req, res) {
        try {
            const { id } = req.params;
            const result = await this.customerService.updateCustomer(id, req.body);
            
            res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Supprimer un client
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async deleteCustomer(req, res) {
        try {
            const { id } = req.params;
            const result = await this.customerService.deleteCustomer(id);
            
            res.status(200).json({
                success: true,
                message: result.message
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Restaurer un client supprimé
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async restoreCustomer(req, res) {
        try {
            const { id } = req.params;
            const result = await this.customerService.restoreCustomer(id);
            
            res.status(200).json({
                success: true,
                message: result.message,
                data: result.data
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Rechercher des clients avec filtres avancés
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async searchCustomers(req, res) {
        try {
            const filters = req.query;
            const result = await this.customerService.searchCustomers(filters);
            
            res.status(200).json({
                success: true,
                data: result.data,
                count: result.count
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    /**
     * Obtenir des statistiques sur les clients
     * @param {Object} req - Requête Express
     * @param {Object} res - Réponse Express
     */
    async getCustomerStats(req, res) {
        try {
            const result = await this.customerService.getCustomerStats();
            
            res.status(200).json({
                success: true,
                data: result.data
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }
}

module.exports = CustomerController;
