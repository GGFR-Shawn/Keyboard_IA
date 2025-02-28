const messageContainer = document.getElementById('message-container');
const userInput = document.getElementById('user-input');
const modelSelect = document.getElementById('model-select');

async function sendMessage() {
  const userMessage = userInput.value.trim();
  const selectedModel = modelSelect.value;
  const token = localStorage.getItem('token'); // Token JWT stocké après login

  if (!userMessage) return;

  addMessage(userMessage, 'user');
  userInput.value = '';

  try {
    const response = await fetch('/api/chat/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userMessage }],
        model: selectedModel,
      }),
    });

    if (!response.ok) throw new Error('Request failed');

    const data = await response.json();
    addMessage(data.choices[0].message.content, 'ai');
  } catch (error) {
    console.error('Send message error:', error);
    alert('Failed to send message');
  }
}

function addMessage(content, sender) {
  const messageElement = document.createElement('div');
  messageElement.classList.add('message', sender);
  messageElement.textContent = content;
  messageContainer.appendChild(messageElement);
  messageContainer.scrollTop = messageContainer.scrollHeight; // Auto-scroll
}