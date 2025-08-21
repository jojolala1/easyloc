const CustomerRepository = require('../repositories/customerRepository');

class CustomerService {
    constructor() {
        this.customerRepository = new CustomerRepository();
    }

    /**
     * Créer un nouveau client
     * @param {Object} customerData - Données du client
     * @returns {Promise<Object>} Client créé
     */
    async createCustomer(customerData) {
        try {
            // Validation métier
            await this.validateCustomerData(customerData);
            
            // Vérifier si le client existe déjà
            const existingCustomer = await this.customerRepository.findByEmail(customerData.email);
            if (existingCustomer) {
                throw new Error('Un client avec cet email existe déjà');
            }

            const existingPermit = await this.customerRepository.findByPermitNumber(customerData.permit_number);
            if (existingPermit) {
                throw new Error('Un client avec ce numéro de permis existe déjà');
            }

            // Créer le client
            const customer = await this.customerRepository.create(customerData);
            
            return {
                success: true,
                message: 'Client créé avec succès',
                data: customer
            };
        } catch (error) {
            throw new Error(`Erreur lors de la création du client: ${error.message}`);
        }
    }

    /**
     * Récupérer un client par son ID
     * @param {string} id - ID du client
     * @returns {Promise<Object>} Client trouvé
     */
    async getCustomerById(id) {
        try {
            const customer = await this.customerRepository.findById(id);
            if (!customer) {
                throw new Error('Client non trouvé');
            }

            return {
                success: true,
                data: customer
            };
        } catch (error) {
            throw new Error(`Erreur lors de la récupération du client: ${error.message}`);
        }
    }

    /**
     * Récupérer tous les clients avec pagination
     * @param {Object} options - Options de pagination et filtres
     * @returns {Promise<Object>} Liste des clients
     */
    async getAllCustomers(options = {}) {
        try {
            const result = await this.customerRepository.findAll(options);
            
            return {
                success: true,
                data: result.customers,
                pagination: result.pagination
            };
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des clients: ${error.message}`);
        }
    }

    /**
     * Rechercher un client par nom complet
     * @param {string} firstname - Prénom
     * @param {string} lastname - Nom
     * @returns {Promise<Object>} Client trouvé
     */
    async findCustomerByFullName(firstname, lastname) {
        try {
            const customer = await this.customerRepository.findByFullName(firstname, lastname);
            if (!customer) {
                throw new Error('Client non trouvé');
            }

            return {
                success: true,
                data: customer
            };
        } catch (error) {
            throw new Error(`Erreur lors de la recherche du client: ${error.message}`);
        }
    }

    /**
     * Rechercher un client par numéro de permis
     * @param {string} permitNumber - Numéro de permis
     * @returns {Promise<Object>} Client trouvé
     */
    async findCustomerByPermitNumber(permitNumber) {
        try {
            const customer = await this.customerRepository.findByPermitNumber(permitNumber);
            if (!customer) {
                throw new Error('Client non trouvé');
            }

            return {
                success: true,
                data: customer
            };
        } catch (error) {
            throw new Error(`Erreur lors de la recherche du client: ${error.message}`);
        }
    }

    /**
     * Mettre à jour un client
     * @param {string} id - ID du client
     * @param {Object} updateData - Données à mettre à jour
     * @returns {Promise<Object>} Client mis à jour
     */
    async updateCustomer(id, updateData) {
        try {
            // Vérifier si le client existe
            const existingCustomer = await this.customerRepository.findById(id);
            if (!existingCustomer) {
                throw new Error('Client non trouvé');
            }

            // Validation des données de mise à jour
            if (updateData.email && updateData.email !== existingCustomer.email) {
                const emailExists = await this.customerRepository.findByEmail(updateData.email);
                if (emailExists) {
                    throw new Error('Un client avec cet email existe déjà');
                }
            }

            if (updateData.permit_number && updateData.permit_number !== existingCustomer.permit_number) {
                const permitExists = await this.customerRepository.findByPermitNumber(updateData.permit_number);
                if (permitExists) {
                    throw new Error('Un client avec ce numéro de permis existe déjà');
                }
            }

            // Mettre à jour le client
            const updatedCustomer = await this.customerRepository.update(id, updateData);
            
            return {
                success: true,
                message: 'Client mis à jour avec succès',
                data: updatedCustomer
            };
        } catch (error) {
            throw new Error(`Erreur lors de la mise à jour du client: ${error.message}`);
        }
    }

    /**
     * Supprimer un client (soft delete)
     * @param {string} id - ID du client
     * @returns {Promise<Object>} Confirmation de suppression
     */
    async deleteCustomer(id) {
        try {
            // Vérifier si le client existe
            const existingCustomer = await this.customerRepository.findById(id);
            if (!existingCustomer) {
                throw new Error('Client non trouvé');
            }

            // Vérifier si le client peut être supprimé (pas de contrats actifs)
            // TODO: Implémenter la vérification des contrats

            // Supprimer le client
            await this.customerRepository.delete(id);
            
            return {
                success: true,
                message: 'Client supprimé avec succès'
            };
        } catch (error) {
            throw new Error(`Erreur lors de la suppression du client: ${error.message}`);
        }
    }

    /**
     * Restaurer un client supprimé
     * @param {string} id - ID du client
     * @returns {Promise<Object>} Client restauré
     */
    async restoreCustomer(id) {
        try {
            const restoredCustomer = await this.customerRepository.restore(id);
            if (!restoredCustomer) {
                throw new Error('Client non trouvé');
            }

            return {
                success: true,
                message: 'Client restauré avec succès',
                data: restoredCustomer
            };
        } catch (error) {
            throw new Error(`Erreur lors de la restauration du client: ${error.message}`);
        }
    }

    /**
     * Rechercher des clients avec filtres avancés
     * @param {Object} filters - Filtres de recherche
     * @returns {Promise<Object>} Liste des clients correspondants
     */
    async searchCustomers(filters = {}) {
        try {
            const customers = await this.customerRepository.search(filters);
            
            return {
                success: true,
                data: customers,
                count: customers.length
            };
        } catch (error) {
            throw new Error(`Erreur lors de la recherche des clients: ${error.message}`);
        }
    }

    /**
     * Obtenir des statistiques sur les clients
     * @returns {Promise<Object>} Statistiques des clients
     */
    async getCustomerStats() {
        try {
            const stats = await this.customerRepository.getStats();
            
            return {
                success: true,
                data: stats
            };
        } catch (error) {
            throw new Error(`Erreur lors de la récupération des statistiques: ${error.message}`);
        }
    }

    /**
     * Valider les données du client
     * @param {Object} customerData - Données du client
     * @private
     */
    async validateCustomerData(customerData) {
        const requiredFields = ['firstname', 'lastname', 'address', 'permit_number', 'email', 'birth_date'];
        
        for (const field of requiredFields) {
            if (!customerData[field]) {
                throw new Error(`Le champ ${field} est requis`);
            }
        }

        // Validation de l'âge
        const birthDate = new Date(customerData.birth_date);
        const age = (new Date() - birthDate) / (1000 * 60 * 60 * 24 * 365.25);
        if (age < 18) {
            throw new Error('Le client doit être majeur (18 ans minimum)');
        }

        // Validation du format du permis
        const permitRegex = /^[A-Z0-9]{12}$/;
        if (!permitRegex.test(customerData.permit_number)) {
            throw new Error('Le numéro de permis doit contenir 12 caractères alphanumériques');
        }

        // Validation du format de l'email
        const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
        if (!emailRegex.test(customerData.email)) {
            throw new Error('Format d\'email invalide');
        }
    }
}

module.exports = CustomerService;
