// backend/middlewares/authMiddleware.js
exports.authMiddleware = (req, res, next) => {
    // Logique pour vérifier l'authentification de l'utilisateur
    const token = req.cookies.token; // Exemple d'utilisation des cookies

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    // Vérifiez la validité du token ici (par exemple, en vérifiant une signature JWT)
    next();
};
