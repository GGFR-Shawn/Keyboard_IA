// backend/app.js
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser'); // Ajoutez ce middleware pour les cookies
const authRoutes = require('./routes/authRoutes');
const chatRoutes = require('./routes/chatRoutes');
const { authMiddleware } = require('./middlewares/authMiddleware');

const app = express();

if (!process.env.JWT_SECRET || !process.env.MONGODB_URI) {
    console.error('Missing environment variables');
    process.exit(1);
}

// Connexion à MongoDB sans les options obsolètes
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connexion à MongoDB réussie'))
    .catch(err => console.error('Erreur de connexion à MongoDB', err));

// Utilisez le middleware pour parser les requêtes JSON
app.use(express.json());

// Ajoutez le middleware cookie-parser
app.use(cookieParser());

// Utilisez le middleware CORS
app.use(cors({
    origin: function (origin, callback) {
        if (['http://78.120.199.35', 'http://localhost:3000'].indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Permet d'inclure les cookies dans les requêtes CORS
    optionsSuccessStatus: 200 // Pour certaines configurations de navigateur
}));

// Utilisez les routes d'authentification (ces routes ne seront pas protégées par authMiddleware)
app.use('/api', authRoutes);

// Middleware d'authentification pour toutes les autres routes
app.use('/api/chat', authMiddleware, chatRoutes); // Exemple de route protégée

// Route par défaut pour tester l'accès aux routes publiques
app.get('/', (req, res) => {
    res.json({ message: 'Bienvenue sur le site' });
});

const PORT = process.env.PORT || 3000;
const IP = process.env.IP || '127.0.0.1'; // Ajoutez une valeur par défaut pour IP si non spécifiée
app.listen(PORT, () => console.log(`Serveur en cours d'exécution sur le port ${IP}:${PORT}`));