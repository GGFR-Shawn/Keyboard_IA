// backend/controllers/chatController.js
const fetch = require('node-fetch-native');

exports.sendMessage = async (req, res) => {
    const userMessage = req.body.messages[0]?.content;
    const selectedModel = req.body.model;

    // Validation des entrées
    if (!userMessage || !selectedModel) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    try {
        const response = await fetch('http://78.120.199.35:2222/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            //  'Authorization': `Bearer ${process.env.LM_STUDIO_API_KEY}`
            },
            body: JSON.stringify({ 
                messages: [
                    { "role": "user", "content": userMessage }
                ],
                temperature: 0.7,
                max_tokens: 4096, 
                stream: false,
                model: selectedModel, 
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        res.json(data);
    } catch (error) {
        console.error('Error fetching chat completion:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Fonction getAllChats pour répondre aux requêtes GET
exports.getAllChats = async (req, res) => {
    try {
        // Logique pour récupérer les chats
        const chats = [
            { id: 1, message: 'Bonjour', model: 'model1' },
            { id: 2, message: 'Comment ça va ?', model: 'model2' }
        ];
        res.json(chats);
    } catch (error) {
        console.error('Error fetching all chats:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};
