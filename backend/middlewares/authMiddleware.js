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

    // Récupérez le token à partir des en-têtes
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    try {
        // Vérifiez la validité du token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
};
