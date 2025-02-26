// backend/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const { sendMessage, getAllChats } = require('../controllers/chatController'); // Importez toutes les fonctions nécessaires

// Route de chat pour envoyer un message (protégée)
router.post('/send', sendMessage);

// Route de chat pour récupérer tous les messages (protégée)
router.get('/', getAllChats);

module.exports = router;
