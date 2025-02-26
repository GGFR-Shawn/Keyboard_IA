// backend/controllers/chatController.js

exports.sendMessage = async (req, res) => {
    const fetch = await import('node-fetch');
    
    const userMessage = req.body.messages[0].content;
    const selectedModel = req.body.model;

    try {
        const response = await fetch.default('http://78.120.199.35:2222/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.JWT_SECRET // Use an environment variable for the secret
            },
            body: JSON.stringify({ 
                messages: [
                    { "role": "user", "content": userMessage }
                ],
                temperature: 0.7,
                max_tokens: -1,
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
