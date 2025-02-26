const rateLimit = require('express-rate-limit');

// Middleware rate limiting (limite le nombre de requêtes par minute)
const limiter = rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 50 // limite à 50 demandes / minute
});

module.exports = limiter;
