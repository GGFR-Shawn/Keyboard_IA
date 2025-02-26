// backend/app.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const whitelist = ['http://78.120.199.35', 'http://localhost:3000']; // Ajoutez les domaines autorisés
const authMiddleware = require('./middlewares/authMiddleware');
const chatRoutes = require('./routes/chatRoutes');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Pour crypter les mots de passe
const jwt = require('jsonwebtoken'); // Pour générer des tokens JWT
const authRoutes = require('./routes/auth'); // Importez le fichier auth.js

// Connexion à MongoDB sans les options obsolètes
mongoose.connect(process.env.MONGODB_URI, {
}).then(() => console.log('Connexion à MongoDB réussie'))
  .catch(err => console.error('Erreur de connexion à MongoDB', err));

const app = express();

// Utilisez le middleware pour parser les requêtes JSON
app.use(express.json());

// Utilisez le middleware pour parser les requêtes URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisez le middleware CORS
app.use(cors({
    origin: function (origin, callback) {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200 // Pour certaines configurations de navigateur
}));

// Utilisez les routes d'authentification (ces routes ne seront pas protégées par authMiddleware)
app.use('/api', authRoutes);

// Utilisez le middleware d'authentification sur toutes les autres routes
app.use(authMiddleware);

// Utilisez les autres routes nécessitant une authentification
app.use('/api/chat', chatRoutes); // Exemple de route protégée

// Route par défaut pour tester l'accès aux routes publiques
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur le site' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${PORT}`));
