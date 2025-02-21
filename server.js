const express = require('express'); // Importez la bibliothèque Express.js
require('dotenv').config(); // Chargez les variables d'environnement à partir du fichier '.env'
const rateLimit = require('express-rate-limit'); // Middleware rate limiting
const jwt = require('jsonwebtoken'); // Middleware authentification par jeton JWT
const cors = require('cors');
const whitelist = ['http://78.120.199.35:3222','http://78.120.199.35:2222']; // Listes des origines approuvées (modifiez en fonction de vos besoins)
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST']
};
const app = express(); // Créez une nouvelle application Express.js
const port = process.env.PORT; // Définissez un port par défaut (vous pouvez le modifier)

// Serveur les fichiers statiques dans le dossier 'public' 
app.use(express.static('public')); 

// Middleware rate limiting (limite le nombre de requêtes par minute)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 50 // limite à 50 demandes / minute
});

app.use(limiter);

// Middleware CORS (pour permettre les requêtes cross-origin)
app.use(cors(corsOptions));

// Middleware authentification par jeton JWT (nécessite un middleware séparé pour la gestion des routes protégées)
const secret = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImVsYXNoIGluZmx1bCJ9.wB7WvDH42gRhUfLsT5nEGd9y-UaLkLQOoAjNp9iKu-zr'; // secret JWT

app.use((req, res, next) => {
  const token = req.headers['x-access-token'];
  if (!token) return res.status(401).json({ auth: false, message: 'Aucun jeton fourni.' });

  jwt.verify(token, secret, (err, decoded) => {
    if (err) return res.status(500).json({ auth: false, message: 'Le jeton est invalide.' });
    req.userId = decoded.id; // Ajouter l'identifiant de l'utilisateur à la demande pour les routes protégées (exemple)
    next();
  });
});

// Démarrage du serveur et affichage des informations de démarrage
app.listen(port, () => {
  console.log(`Server running at http://${process.env.IP}:${port}`); 
});