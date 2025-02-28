const fetch = require('node-fetch');
const mongoose = require('mongoose');
const Chat = mongoose.model('Chat', new mongoose.Schema({
  userId: String,
  message: String,
  response: String,
  model: String,
  timestamp: { type: Date, default: Date.now }
}));

exports.sendMessage = async (req, res) => {
  const { messages, model } = req.body;
  const userId = req.userId; // Ajouté via authMiddleware

  if (!messages?.length || !model) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const userMessage = messages[0].content;

  try {
    const response = await fetch(process.env.API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.LM_STUDIO_API_KEY}`,
      },
      body: JSON.stringify({
        messages: [{ role: 'user', content: userMessage }],
        temperature: 0.7,
        max_tokens: 4096,
        stream: false,
        model,
      }),
      timeout: 10000, // Timeout de 10 secondes
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Sauvegarde dans MongoDB
    await new Chat({ userId, message: userMessage, response: aiResponse, model }).save();

    res.json(data);
  } catch (error) {
    console.error('Chat error:', error);
    res.status(500).json({ error: 'Failed to process message' });
  }
};

exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ userId: req.userId });
    res.json(chats);
  } catch (error) {
    console.error('Get chats error:', error);
    res.status(500).json({ error: 'Failed to fetch chats' });
  }
};