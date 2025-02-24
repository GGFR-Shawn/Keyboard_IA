const messageContainer = document.getElementById('message-container');
const userInput = document.getElementById('user-input');

function sendMessage() {
    const userMessage = userInput.value.trim();

    if (userMessage !== '') {
        // Ajoute le message de l'utilisateur
        addMessage(userMessage, 'user');
        userInput.value = '';

        // Envoie la requête au serveur Node.js et affiche les résultats
        fetch('http://78.120.199.35:2222/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6ImVsYXNoIGluZmx1bCJ9.wB7WvDH42gRhUfLsT5nEGd9y-UaLkLQOoAjNp9iKu-zr' // Remplacez par un jeton d'authentification valide
            },
            body: JSON.stringify({ // Encapsulez les données dans un format JSON
                messages: [
                    { "role": "user", "content": userMessage }
                ],
                temperature: 0.7,
                max_tokens: -1,
                stream: false,
                model: 'qwen2.5-coder-32b-instruct',
                //model: 'TheBloke/Open_Gpt4_8x7B_v0.2-GGUF/open_gpt4_8x7b_v0.2.Q4_0.gguf' //  LM Studio
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
        // Vérifiez si le message contient du code pour l'encadrer
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

