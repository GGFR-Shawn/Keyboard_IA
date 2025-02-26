// frontend/main.js
const messageContainer = document.getElementById('message-container');
const userInput = document.getElementById('user-input');
const modelSelect = document.getElementById('model-select');

function sendMessage() {
    const userMessage = userInput.value.trim();
    const selectedModel = modelSelect.value;

    if (userMessage !== '') {
        // Ajoute le message de l'utilisateur
        addMessage(userMessage, 'user');
        userInput.value = '';

        // Envoie la requête au serveur Node.js et affiche les résultats
        fetch('http://78.120.199.35:2222/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${process.env.JWT_CLIENT_TOKEN}` // Utiliser une variable d'environnement pour le jeton JWT du client
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
        })
        .then(response => response.json())
        .then(data => {
            addMessage(data.choices[0].message.content, 'ai');
        })
        .catch(error => {
            console.error('Erreur lors de l\'envoi du message:', error);
            alert('Une erreur est survenue lors de l\'envoi du message.');
        });
    }
}

function addMessage(content, sender) {
    const messageElement = document.createElement('div');
    messageElement.classList.add('message', sender);
    messageElement.textContent = content;
    messageContainer.appendChild(messageElement);
}
