// backend/app.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth');
const chatRoutes = require('./routes/chatRoutes');

const app = express();

// Connexion à MongoDB sans les options obsolètes
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Utilisez le middleware pour parser les requêtes JSON
app.use(express.json());

// Utilisez le middleware pour parser les requêtes URL-encoded
app.use(bodyParser.urlencoded({ extended: true }));

// Utilisez le middleware CORS
app.use(cors({
    origin: function (origin, callback) {
        if (['http://78.120.199.35', 'http://localhost:3000'].indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    optionsSuccessStatus: 200 // Pour certaines configurations de navigateur
}));

// Utilisez les routes d'authentification (ces routes ne seront pas protégées par authMiddleware)
app.use('/api', authRoutes);

// Middleware d'authentification
const authMiddleware = require('./middlewares/authMiddleware');

// Utilisez le middleware d'authentification sur toutes les autres routes
app.use(authMiddleware);

// Utilisez les autres routes nécessitant une authentification
app.use('/api/chat', chatRoutes); // Exemple de route protégée

// Route par défaut pour tester l'accès aux routes publiques
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur le site' });
});

const PORT = process.env.PORT || 3000;
const IP = process.env.IP
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${IP}:${PORT}`));
