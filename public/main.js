const messageContainer = document.getElementById('message-container');
const userInput = document.getElementById('user-input');

function sendMessage() {
  const userMessage = userInput.value.trim();

  if (userMessage !== '') {
    // Envoie la requête au serveur Node.js et affiche les résultats
    messageContainer.innerHTML += `<div class="message user"><p>${userMessage}</p></div>`;
    userInput.value = '';

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
        model: 'TheBloke/Open_Gpt4_8x7B_v0.2-GGUF/open_gpt4_8x7b_v0.2.Q4_0.gguf' //  LM Studio
      })
    })
    .then(response => response.json())
    .then(data => {
      const botMessage = data.choices[0].message.content;
      messageContainer.innerHTML += `<div class="message assistant"><p>${botMessage}</p></div>`;
    })
    .catch(error => console.log('Error:', error));
  }
}
