//backend/routes/chatRoutes.js
const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Route pour envoyer un message au modèle IA
router.post('/completions', chatController.sendMessage);

module.exports = router;
