// routes/auth.js
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs'); // Pour crypter les mots de passe
const jwt = require('jsonwebtoken'); // Pour générer des tokens JWT
const User = require('../models/User'); // Assurez-vous d'avoir un modèle pour User
const { body, validationResult } = require('express-validator');

// Route d'inscription
router.post('/register', [
    body('username').isLength({ min: 3 }).withMessage('Le nom d\'utilisateur doit avoir au moins 3 caractères'),
    body('email').isEmail().withMessage('Adresse e-mail invalide'),
    body('password').isLength({ min: 6 }).withMessage('Le mot de passe doit avoir au moins 6 caractères')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        let user = await User.findOne({ email: req.body.email });
        if (user) {
            return res.status(400).json({ msg: 'Utilisateur déjà existant' });
        }

        user = new User({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password
        });

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt);

        await user.save();

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '3600s' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur');
    }
});

// Route de connexion
router.post('/login', [
    body('email').isEmail().withMessage('Adresse e-mail invalide'),
    body('password').exists().withMessage('Le mot de passe est requis')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ msg: 'Identifiants invalides' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ msg: 'Identifiants invalides' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '3600s' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Erreur du serveur');
    }
});

module.exports = router;
