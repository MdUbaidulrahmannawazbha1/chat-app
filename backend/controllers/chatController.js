const BOT_NAME = 'NawazBot';

const getSuggestions = (reply) => {
  const normalized = reply.toLowerCase();

  if (normalized.includes('customize')) {
    return [
      'How do I change the bot personality?',
      'Can I connect a real AI API?',
      'Show me the app structure.'
    ];
  }

  if (normalized.includes('features')) {
    return [
      'Give me a project idea',
      'How do I make it my own version?',
      'What can you help me with?'
    ];
  }

  return [
    'What can you do?',
    'How do I make this project my own?',
    'Show me a chatbot idea for my app.'
  ];
};

const buildReply = ({ message, userName = 'there', history = [] }) => {
  const text = String(message || '').trim().toLowerCase();
  const historyHint = history
    .slice(-3)
    .map((item) => item.content)
    .join(' ')
    .toLowerCase();

  if (!text) {
    return {
      reply: `Tell me what you want ${BOT_NAME} to help with.`,
      suggestions: getSuggestions('')
    };
  }

  if (/^(hi|hello|hey|yo)\b/.test(text)) {
    return {
      reply: `Hey ${userName}. I am ${BOT_NAME}, your custom chatbot version. Ask me about the project, UI ideas, or how to make this app feel more personal.`,
      suggestions: ['What can you do?', 'How do I make this project my own?', 'Give me a chatbot idea.']
    };
  }

  if (text.includes('who are you') || text.includes('what are you')) {
    return {
      reply: `${BOT_NAME} is a lightweight chatbot starter built from your chat app. It is designed to feel personal, simple, and easy to extend.`,
      suggestions: ['How do I change the bot name?', 'Can I add a real AI API?', 'What makes this version different?']
    };
  }

  if (text.includes('make this project my own') || text.includes('custom') || text.includes('personal')) {
    return {
      reply: 'Start by changing the bot name, colors, welcome text, and quick prompts. Then add your own personality, saved conversations, and a custom API when you are ready.',
      suggestions: ['Show me the app structure.', 'Can I connect a real AI API?', 'What should I rename first?']
    };
  }

  if (text.includes('project idea') || text.includes('use case')) {
    return {
      reply: 'A strong version of this app could be a personal study assistant, a portfolio chatbot, or a support bot for your own product.',
      suggestions: ['Give me a portfolio chatbot idea.', 'How can I brand it?', 'What features should I add next?']
    };
  }

  if (text.includes('help') || text.includes('what can you do')) {
    return {
      reply: 'I can help you turn this repo into a chatbot, suggest UI copy, draft starter prompts, and outline the next code changes.',
      suggestions: ['Give me a chatbot idea for my app.', 'How do I make it my own version?', 'Show me the app structure.']
    };
  }

  if (text.includes('api') || text.includes('openai') || text.includes('ai')) {
    return {
      reply: 'Yes. You can swap this rule-based reply engine for a real AI provider later. The current version keeps everything self-contained so it works out of the box.',
      suggestions: ['How do I connect an AI API?', 'Can I keep the current fallback?', 'What backend changes are needed?']
    };
  }

  if (text.includes('history') || historyHint.includes('custom')) {
    return {
      reply: 'We have been shaping this into a personal chatbot. The cleanest next step is to rename the assistant, tune the theme, and add your own response rules.',
      suggestions: ['Rename the bot.', 'Change the theme.', 'Add more response rules.']
    };
  }

  if (text.includes('thank')) {
    return {
      reply: `You are welcome. I can keep helping you refine ${BOT_NAME} or add more features whenever you want.`,
      suggestions: ['What should I build next?', 'How do I customize the design?', 'Show me the app structure.']
    };
  }

  return {
    reply: `I heard: "${message}". I can help you shape this into a personal chatbot by adjusting the layout, prompts, and backend response rules.`,
    suggestions: getSuggestions(text)
  };
};

const getChatReply = (req, res) => {
  try {
    const { message, history = [], userName } = req.body;
    const result = buildReply({ message, history, userName });

    res.json({
      botName: BOT_NAME,
      reply: result.reply,
      suggestions: result.suggestions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getChatReply
};