// backend/controllers/chatController.js

// Encapsulez l'importation de 'node-fetch' dans une fonction async
async function importFetch() {
    const fetch = await import('node-fetch');
    return fetch.default;
}

let fetch;

// Initialisez 'fetch' dès que le module est chargé
(async () => {
    fetch = await importFetch();
})();

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
                // Si LM Studio nécessite une autorisation spécifique, ajoutez-la ici
                // 'Authorization': `Bearer ${process.env.LM_STUDIO_API_KEY}`
            },
            body: JSON.stringify({ 
                messages: [
                    { "role": "user", "content": userMessage }
                ],
                temperature: 0.7,
                max_tokens: 150, // Définissez une valeur positive pour max_tokens
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
