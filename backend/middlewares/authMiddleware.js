// middlewares/authMiddleware.js
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    // Liste des routes qui n'ont pas besoin d'authentification
    const publicRoutes = [
        '/api/register',
        '/api/login'
    ];

    // Vérifiez si la route est dans la liste des routes publiques
    if (publicRoutes.includes(req.path)) {
        return next();
    }

    // Récupérez le token du header de la requête
    const token = req.header('x-access-token');

    // Si aucun token n'est fourni, renvoyez une erreur
    if (!token) {
        return res.status(401).json({ auth: false, message: 'Aucun jeton fourni.' });
    }

    // Vérifiez la validité du token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(500).json({ auth: false, message: 'Token invalide.' });
        }
        req.userId = decoded.id;
        next();
    });
};
