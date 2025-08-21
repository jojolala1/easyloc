# 🚗 EasyLoc API - Gestion de Location de Véhicules

## 📋 Description

EasyLoc est une API REST moderne pour la gestion de location de véhicules, construite avec Node.js et Express. L'application démontre une architecture propre avec des composants d'accès aux données SQL et NoSQL.

## 🏗️ Architecture

L'application suit une architecture en couches (Layered Architecture) :

```
┌─────────────────────────────────────┐
│           Controllers               │  ← Gestion des requêtes HTTP
├─────────────────────────────────────┤
│            Services                 │  ← Logique métier
├─────────────────────────────────────┤
│          Repositories               │  ← Accès aux données
├─────────────────────────────────────┤
│            Models                   │  ← Schémas de données
├─────────────────────────────────────┤
│         Configuration               │  ← Connexions DB
└─────────────────────────────────────┘
```

## 🗄️ Technologies Utilisées

### Backend
- **Node.js** (v18+) - Runtime JavaScript
- **Express.js** - Framework web
- **Mongoose** - ODM pour MongoDB
- **MSSQL** - Driver SQL Server

### Base de Données
- **MongoDB** - Base NoSQL pour clients et véhicules
- **SQL Server** - Base SQL pour contrats et facturation

### Sécurité & Qualité
- **Helmet** - Sécurité des en-têtes HTTP
- **CORS** - Gestion des origines croisées
- **Rate Limiting** - Protection contre le spam
- **Morgan** - Logging des requêtes
- **Joi** - Validation des données

## 🚀 Installation

### Prérequis
- Node.js 18+ 
- MongoDB 6+
- SQL Server 2019+
- npm ou yarn

### Installation des dépendances
```bash
npm install
```

### Configuration des variables d'environnement
Créez un fichier `.env` à la racine du projet :

```env
# Configuration MongoDB
MONGO_URI=mongodb://localhost:27017/easyloc

# Configuration SQL Server
SQL_SERVER=localhost
SQL_DATABASE=easyloc
SQL_USER=sa
SQL_PASSWORD=votre_mot_de_passe
SQL_PORT=1433

# Configuration de l'API
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001
```

### Démarrage de l'application
```bash
# Mode développement (avec nodemon)
npm run dev

# Mode production
npm start
```

## 📚 API Endpoints

### Clients (MongoDB - NoSQL)

#### Créer un client
```http
POST /api/customers
Content-Type: application/json

{
  "firstname": "Jean",
  "lastname": "Dupont",
  "address": "123 Rue de la Paix, Paris",
  "permit_number": "AB1234567890",
  "email": "jean.dupont@email.com",
  "phone": "0123456789",
  "birth_date": "1990-01-01"
}
```

#### Récupérer tous les clients
```http
GET /api/customers?page=1&limit=10&sort={"createdAt":-1}
```

#### Rechercher un client par nom
```http
GET /api/customers/search/name?firstname=Jean&lastname=Dupont
```

#### Récupérer un client par ID
```http
GET /api/customers/:id
```

#### Mettre à jour un client
```http
PUT /api/customers/:id
Content-Type: application/json

{
  "address": "456 Avenue des Champs, Lyon"
}
```

#### Supprimer un client
```http
DELETE /api/customers/:id
```

#### Restaurer un client supprimé
```http
PATCH /api/customers/:id/restore
```

#### Statistiques des clients
```http
GET /api/customers/stats
```

### Véhicules (MongoDB - NoSQL)

*Endpoints similaires aux clients (à implémenter)*

### Contrats (SQL Server - SQL)

*Endpoints pour la gestion des contrats (à implémenter)*

### Facturation (SQL Server - SQL)

*Endpoints pour la gestion de la facturation (à implémenter)*

## 🔧 Structure du Projet

```
src/
├── config/
│   └── database.js          # Configuration des bases de données
├── controllers/
│   └── customerController.js # Contrôleur des clients
├── models/
│   ├── customerModel.js     # Modèle Mongoose Client
│   └── vehicleModel.js      # Modèle Mongoose Véhicule
├── repositories/
│   ├── customerRepository.js # Repository des clients
│   └── vehicleRepository.js  # Repository des véhicules
├── services/
│   └── customerService.js   # Service métier des clients
├── routes/
│   └── customerRoutes.js    # Routes de l'API clients
├── middleware/               # Middlewares personnalisés
├── utils/                    # Utilitaires
└── app.js                   # Point d'entrée de l'application
```

## 🧪 Tests

```bash
# Lancer tous les tests
npm test

# Tests en mode watch
npm run test:watch

# Tests avec couverture
npm run test:coverage
```

## 📝 Validation des Données

### Client
- **firstname** : 2-50 caractères, requis
- **lastname** : 2-50 caractères, requis
- **address** : 1-200 caractères, requis
- **permit_number** : 12 caractères alphanumériques, unique, requis
- **email** : Format email valide, unique, requis
- **phone** : Format français (+33 ou 0), optionnel
- **birth_date** : Date valide, âge minimum 18 ans, requis

### Véhicule
- **licence_plate** : Format AB-123-CD, unique, requis
- **brand** : 2-50 caractères, requis
- **model** : 2-50 caractères, requis
- **year** : 1900-année actuelle+1, requis
- **category** : Enum (citadine, berline, break, suv, utilitaire, moto, camion), requis
- **fuel_type** : Enum (essence, diesel, hybride, électrique, gpl), requis
- **transmission** : Enum (manuelle, automatique), requis
- **km** : 0-1000000, requis
- **daily_rate** : ≥ 0, requis

## 🔒 Sécurité

- **Helmet** : Sécurisation des en-têtes HTTP
- **CORS** : Contrôle des origines autorisées
- **Rate Limiting** : Protection contre les attaques par déni de service
- **Validation** : Validation stricte des données d'entrée
- **Sanitisation** : Nettoyage automatique des données

## 📊 Fonctionnalités

### ✅ Implémentées
- [x] Architecture en couches
- [x] Gestion des clients (CRUD complet)
- [x] Validation des données
- [x] Gestion des erreurs
- [x] Pagination
- [x] Recherche avancée
- [x] Soft delete
- [x] Statistiques
- [x] Sécurité de base

### 🚧 En cours / À implémenter
- [ ] Gestion des véhicules
- [ ] Gestion des contrats (SQL)
- [ ] Gestion de la facturation (SQL)
- [ ] Authentification JWT
- [ ] Autorisation RBAC
- [ ] Tests unitaires
- [ ] Tests d'intégration
- [ ] Documentation Swagger
- [ ] Monitoring et métriques

## 🎯 Points Forts pour le Dossier DWWM

### Architecture
- **Séparation des responsabilités** : Chaque couche a un rôle défini
- **Pattern Repository** : Abstraction de l'accès aux données
- **Pattern Service** : Logique métier centralisée
- **Injection de dépendances** : Couplage faible entre composants

### Composants d'Accès aux Données
- **MongoDB (NoSQL)** : Modèles Mongoose avec validation et middleware
- **SQL Server (SQL)** : Requêtes paramétrées et gestion des connexions
- **Gestion des erreurs** : Try/catch et messages d'erreur explicites
- **Transactions** : Gestion des opérations atomiques

### Qualité du Code
- **Documentation** : JSDoc sur toutes les méthodes
- **Validation** : Schémas Mongoose et validation métier
- **Gestion des erreurs** : Middleware global et codes HTTP appropriés
- **Tests** : Structure prête pour les tests unitaires et d'intégration

## 🤝 Contribution

1. Fork le projet
2. Créez une branche feature (`git checkout -b feature/AmazingFeature`)
3. Committez vos changements (`git commit -m 'Add some AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 👨‍💻 Auteur

**Votre Nom** - [votre-email@domain.com](mailto:votre-email@domain.com)

---

⭐ N'oubliez pas de mettre une étoile si ce projet vous a aidé !
