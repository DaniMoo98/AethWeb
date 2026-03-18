// ============================================================
//  AETHRYA CHRONICLER — AI Chat Widget
//  Parchment-scroll UI, connects to Cloudflare Worker/Gemini
// ============================================================

document.addEventListener('DOMContentLoaded', () => {
  initChronicler();
});

const CHRONICLER_CONFIG = {
  apiKey: 'AIzaSyBQrvoC6pY9IopMdJCXp_n1qhrg93Vivoc',
  apiEndpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent',
  greeting: `Hail, traveler. I am the Chronicler of Aethrya, a humble sage who has walked the Sword Coast for many an age. I know of the gods of Faerûn — from Mystra, Lady of Mysteries, to Tyr the Just, and the countless powers that shape these lands.\n\nHow may I assist you- Ask me of lore, character creation, or the world that awaits.`,
  errorMessage: 'The scrying pool grows dim... I cannot reach the outer planes at this moment. Please try again shortly.',
  placeholderText: 'Ask the Chronicler...',
};

function initChronicler() {
  const toggleBtn = document.querySelector('.chronicler-toggle');
  const panel = document.querySelector('.chronicler-panel');
  const input = document.querySelector('.chronicler-input input');
  const sendBtn = document.querySelector('.chronicler-input button');
  const messagesContainer = document.querySelector('.chronicler-messages');

  if (!toggleBtn || !panel) return;

  let isOpen = false;
  let conversationHistory = [];

  // Toggle panel
  toggleBtn.addEventListener('click', () => {
    isOpen = !isOpen;
    panel.classList.toggle('open', isOpen);
    toggleBtn.classList.toggle('active', isOpen);

    if (isOpen && messagesContainer.children.length <= 1) {
      // Show greeting on first open
      addMessage('ai', CHRONICLER_CONFIG.greeting);
    }

    if (isOpen) {
      setTimeout(() => input?.focus(), 300);
    }
  });

  // Send message
  function sendMessage() {
    const text = input?.value.trim();
    if (!text) return;

    addMessage('user', text);
    input.value = '';
    conversationHistory.push({ role: 'user', content: text });

    showTypingIndicator(true);

    fetchChroniclerResponse(text, conversationHistory)
      .then(response => {
        showTypingIndicator(false);
        addMessage('ai', response);
        conversationHistory.push({ role: 'assistant', content: response });
      })
      .catch(() => {
        showTypingIndicator(false);
        addMessage('ai', CHRONICLER_CONFIG.errorMessage);
      });
  }

  sendBtn?.addEventListener('click', sendMessage);

  input?.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  });

  // Add message to chat
  function addMessage(sender, text) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${sender}`;

    const senderLabel = document.createElement('div');
    senderLabel.className = 'sender';
    senderLabel.textContent = sender === 'ai' ? '📜 The Chronicler' : '⚔️ You';

    const content = document.createElement('div');
    content.className = 'message-content';
    content.textContent = text;

    msgDiv.appendChild(senderLabel);
    msgDiv.appendChild(content);
    messagesContainer.appendChild(msgDiv);

    // Auto-scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // Typing indicator
  function showTypingIndicator(show) {
    const indicator = document.querySelector('.typing-indicator');
    if (indicator) {
      indicator.classList.toggle('visible', show);
      if (show) {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
    }
  }
}

/* ---- API Communication ---- */
async function fetchChroniclerResponse(userMessage, history) {
  try {
    // If we're using the direct Gemini API
    if (CHRONICLER_CONFIG.apiEndpoint.includes('googleapis.com')) {
      const response = await fetch(`${CHRONICLER_CONFIG.apiEndpoint}?key=${CHRONICLER_CONFIG.apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: userMessage }]
          }]
        }),
      });

      if (!response.ok) throw new Error(`Gemini API error: ${response.status}`);
      const data = await response.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || CHRONICLER_CONFIG.errorMessage;
    }

    // Otherwise, use the proxy/worker endpoint
    const response = await fetch(CHRONICLER_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: userMessage,
        history: history.slice(-10),
      }),
    });

    if (!response.ok) throw new Error(`API error: ${response.status}`);
    const data = await response.json();
    return data.reply || data.response || CHRONICLER_CONFIG.errorMessage;
  } catch (error) {
    console.warn('Chronicler API unavailable:', error.message);
    return getOfflineResponse(userMessage);
  }
}

/* ---- Offline Fallback Responses ---- */
function getOfflineResponse(query) {
  const q = query.toLowerCase();

  const responses = [
    {
      keywords: ['gods', 'deity', 'deities', 'pantheon', 'mystra', 'tyr', 'selune', 'corellon', 'moradin', 'lathander', 'tempus', 'kelemvor'],
      response: `The Faerûnian Pantheon is vast and storied. Mystra governs the Weave of magic itself. Tyr, the Maimed God, upholds justice and law. Selûne lights the night sky while her dark twin Shar lurks in shadow. Corellon Larethian watches over the elves, and Moradin forges the dwarven soul. Lathander brings the dawn, Tempus rules the field of battle, and Kelemvor guides the dead to their final rest. Which deity or domain interests you-`
    },
    {
      keywords: ['race', 'races', 'elf', 'dwarf', 'human', 'halfling'],
      response: `The peoples of the Sword Coast are as varied as the stars. Humans dominate the trade cities, while elves keep their ancient vigils in the High Forest. Dwarves hold fast to their mountain strongholds, and halflings find comfort in the rolling hills. More exotic folk — tieflings, dragonborn, and others — walk these lands as well, though they may face suspicion in less worldly settlements. Which race interests you-`
    },
    {
      keywords: ['class', 'fighter', 'wizard', 'rogue', 'cleric', 'barbarian'],
      response: `Your class defines your calling — not merely what you do, but who you are. A fighter sees the world as a tactical challenge, while a cleric serves powers greater than themselves. The wizard's mind holds secrets that bend reality, and the rogue sees opportunities where others see walls. There are thirteen paths in Aethrya, including the humble Civilian. Which calling speaks to you-`
    },
    {
      keywords: ['sword coast', 'setting', 'world', 'forgotten realms', 'lore'],
      response: `The Sword Coast North stretches from the great city of Waterdeep to the frozen reaches of Icewind Dale. It is a land of untamed wilderness, ancient ruins, and cities that cling to civilization by blade and spell. Here in Aethrya, the stories of heroes and villains are written anew each season, in the shadow of mountains and the glow of hearthfires.`
    },
    {
      keywords: ['help', 'start', 'new', 'guide', 'how'],
      response: `Welcome, new adventurer! I recommend beginning with our New Player Guide, which will walk you through character creation, the rules of our realm, and how to join the story. You should also familiarize yourself with the races and classes available to you. Would you like to know more about any of these-`
    },
  ];

  for (const entry of responses) {
    if (entry.keywords.some(kw => q.includes(kw))) {
      return entry.response;
    }
  }

  return `An interesting inquiry indeed. The archives of Aethrya hold much knowledge, but I must consult the deeper tomes for this answer. Once my connection to the outer planes is restored, I shall have a more thorough response. In the meantime, explore the guides and lore sections of this portal — much wisdom awaits.`;
}
