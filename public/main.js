const messageContainer = document.getElementById('message-container');
const userInput = document.getElementById('user-input');
const modelSelect = document.getElementById('model-select'); // Nouvelle ligne

function sendMessage() {
    const userMessage = userInput.value.trim();
    const selectedModel = modelSelect.value; // Récupère le modèle sélectionné par l'utilisateur

    if (userMessage !== '') {
        // Ajoute le message de l'utilisateur
        addMessage(userMessage, 'user');
        userInput.value = '';

        // Envoie la requête au serveur Node.js et affiche les résultats
        fetch('http://78.120.199.35:2222/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImVsYXNoIGluZmx1YyJ9.wB7WvDH42gRhUfLsT5nEGd9y-UaLkLQOoAjNp9iKu-zr' // Remplacez par un jeton d'authentification valide
            },
            body: JSON.stringify({ // Encapsule les données dans un format JSON
                messages: [
                    { "role": "user", "content": userMessage }
                ],
                temperature: 0.7,
                max_tokens: -1,
                stream: false,
                model: selectedModel, // Utilise le modèle sélectionné par l'utilisateur
            })
        })
        .then(response => response.json())
        .then(data => {
            const botMessage = data.choices[0].message.content;
            addMessage(botMessage, 'assistant');
        })
        .catch(error => console.log('Error:', error));
    }
}

function addMessage(content, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;

    if (type === 'user') {
        messageDiv.innerHTML = `<p>${content}</p>`;
    } else if (type === 'assistant') {
        // Vérifie si le message contient du code pour l'encadrer
        const formattedContent = formatCodeBlocks(content);
        messageDiv.innerHTML = `<p>${formattedContent}</p>`;
    }

    messageContainer.appendChild(messageDiv);

    // Scroll to the bottom of the container after adding a new message
    messageContainer.scrollTop = messageContainer.scrollHeight;
}

function formatCodeBlocks(text) {
    return text.replace(/```([\s\S]*?)```/g, (match, codeBlock) => {
        return `<pre class="code-block"><code>${escapeHtml(codeBlock.trim())}</code></pre>`;
    });
}

function escapeHtml(unsafe) {
    return unsafe
         .replace(/&/g, "&amp;")
         .replace(/</g, "&lt;")
         .replace(/>/g, "&gt;")
         .replace(/"/g, "&quot;")
         .replace(/'/g, "&#039;");
}
