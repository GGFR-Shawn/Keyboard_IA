const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const authRoutes = require('./routes/authRoutes'); // Vérifiez ce chemin
const chatRoutes = require('./routes/chatRoutes');
const { authMiddleware } = require('./middlewares/authMiddleware');

dotenv.config();
const app = express();

// Vérification des variables d'environnement critiques
const requiredEnv = ['JWT_SECRET', 'MONGODB_URI'];
requiredEnv.forEach(env => {
  if (!process.env[env]) {
    console.error(`Missing critical env variable: ${env}`);
    process.exit(1);
  }
});

// Connexion à MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middlewares
app.use(morgan('dev')); // Logging pour voir les requêtes
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: ['http://78.120.199.35', 'http://localhost:3000'],
  credentials: true,
}));

// Routes
app.use('/api', authRoutes); // Routes d'authentification sous /api
app.use('/api/chat', authMiddleware, chatRoutes); // Routes de chat protégées

// Route de test
app.get('/', (req, res) => {
  res.json({ message: 'Server is running' });
});

// Gestion des erreurs globales
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Démarrage du serveur
const PORT = process.env.APP_PORT || 3222;
const IP = process.env.APP_IP || '0.0.0.0';
app.listen(PORT, IP, () => console.log(`Server running on ${IP}:${PORT}`));