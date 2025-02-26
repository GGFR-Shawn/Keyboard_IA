const jwt = require('jsonwebtoken');

const secret = process.env.JWT_SECRET; // Secret JWT

const payload = {
  id: process.env.ID, // Remplacez par l'identifiant de l'utilisateur
  name: process.env.NAME // Remplacez par le nom de l'utilisateur
};

const token = jwt.sign(payload, secret, { expiresIn: '1h' }); // Jeton expirant dans une heure

console.log('Generated Token:', token);