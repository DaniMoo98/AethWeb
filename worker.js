// ============================================================
//  AETHRYA CHRONICLER — Cloudflare Worker (Gemini API Bridge)
//  Deploy as a Cloudflare Worker with GEMINI_API_KEY secret
// ============================================================

const SYSTEM_PROMPT = `You are the Aethrya Chronicler, a Sage of the Sword Coast. You provide lore-rich information about the Forgotten Realms. You guide players through character creation and world history.

You speak in a warm, scholarly tone — like a well-read sage who has traveled the breadth of Faerûn. You reference the Forgotten Realms pantheon (Mystra, Tyr, Selûne, Corellon Larethian, Moradin, Lathander, Tempus, Kelemvor, and others), geography, and history naturally. Only use real, canon Forgotten Realms lore — never invent deities, locations, or history.

Keep responses concise but flavorful. Use evocative language. When discussing game mechanics, weave them into narrative context. You may use brief in-character flourishes, but remain helpful and informative above all.`;

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export default {
  async fetch(request, env) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: corsHeaders(),
      });
    }

    const url = new URL(request.url);

    // If not the API, serve static assets
    if (!url.pathname.startsWith('/api/')) {
      if (typeof env.ASSETS !== 'undefined') {
        return env.ASSETS.fetch(request);
      }
      // Fallback if env.ASSETS is missing (depends on wrangler version)
      return new Response("Asset service unavailable", { status: 500 });
    }

    // Only accept POST to /api/chronicler
    if (request.method !== 'POST' || url.pathname !== '/api/chronicler') {
      return new Response(JSON.stringify({ error: 'Endpoint not found or method not allowed' }), {
        status: 404,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      });
    }

    try {
      const { message, history } = await request.json();

      if (!message || typeof message !== 'string') {
        return new Response(JSON.stringify({ error: 'Message is required' }), {
          status: 400,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        });
      }

      const apiKey = env.GEMINI_API_KEY;
      if (!apiKey) {
        return new Response(JSON.stringify({ error: 'API key not configured' }), {
          status: 500,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        });
      }

      // Build conversation contents for Gemini
      const contents = [];

      // Add conversation history (last 10 messages)
      if (history && Array.isArray(history)) {
        for (const msg of history.slice(-10)) {
          contents.push({
            role: msg.role === 'user' ? 'user' : 'model',
            parts: [{ text: msg.content }],
          });
        }
      }

      // Ensure the latest user message is included
      if (!contents.length || contents[contents.length - 1].parts[0].text !== message) {
        contents.push({
          role: 'user',
          parts: [{ text: message }],
        });
      }

      // Call Gemini API
      const geminiResponse = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: SYSTEM_PROMPT }],
          },
          contents,
          generationConfig: {
            temperature: 0.8,
            topP: 0.9,
            topK: 40,
            maxOutputTokens: 1024,
          },
        }),
      });

      if (!geminiResponse.ok) {
        const errorText = await geminiResponse.text();
        console.error('Gemini API error:', errorText);
        return new Response(JSON.stringify({ error: 'Chronicler unavailable' }), {
          status: 502,
          headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
        });
      }

      const data = await geminiResponse.json();
      const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
        || 'The scrying pool grows dim... I cannot form a response at this moment.';

      return new Response(JSON.stringify({ reply }), {
        status: 200,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      });

    } catch (err) {
      console.error('Worker error:', err);
      return new Response(JSON.stringify({ error: 'Internal server error' }), {
        status: 500,
        headers: { ...corsHeaders(), 'Content-Type': 'application/json' },
      });
    }
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}
