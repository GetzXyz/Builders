import { BuildRequest, BuildResponse } from '@/types/build';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

async function callGroq(systemPrompt: string, userPrompt: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API error ${res.status}: ${text}`);
  }

  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from Groq API');
  }
  return content;
}

export async function generateBuild(request: BuildRequest): Promise<BuildResponse> {
  const systemPrompt = `You are an expert PC builder. Respond ONLY with valid JSON matching this exact shape:
{
  "id": string, "name": string, "tier": string,
  "totalPrice": number, "currency": string,
  "components": { "<category>": { "name": string, "brand": string, "price": number, "currency": string, "reason": string } },
  "performance": {
    "games": [{ "name": string, "resolution": string, "preset": string, "avgFPS": number, "lowFPS": number, "confidence": number }],
    "synthetic": { "singleCore": number, "multiCore": number, "gpuScore": number, "memoryScore": number },
    "summary": string
  },
  "peripherals": [{ "category": "keyboard"|"mouse"|"headphones", "name": string, "brand": string, "price": number, "currency": string, "tier": "budget"|"mid"|"premium", "reason": string }],
  "compatibility": { "overall": boolean, "issues": string[], "warnings": string[], "suggestions": string[] },
  "summary": string, "upgradePath": string
}
Component categories: cpu, gpu, motherboard, ram, storage, psu, case, cooler. Stay within budget. Use realistic current prices for the given region and currency.`;

  const userPrompt = `Build a PC with:
- Budget: ${request.budget} ${request.currency}
- Region: ${request.region}
- Primary usage: ${request.usage}
- Include monitor: ${request.preferences?.includeMonitor ? 'yes' : 'no'}
- Include peripherals: ${request.preferences?.includePeripherals ? 'yes' : 'no'}`;

  const content = await callGroq(systemPrompt, userPrompt);
  return JSON.parse(content) as BuildResponse;
}

export async function searchComponents(query: string, region: string, currency: string) {
  const systemPrompt = `You are a PC component search engine. Respond ONLY with valid JSON:
{ "results": [{ "name": string, "brand": string, "category": string, "price": number, "currency": string, "specs": object, "reason": string }] }
Return up to 8 relevant components with realistic current prices for the given region and currency.`;

  const userPrompt = `Search for: "${query}" (region: ${region}, currency: ${currency})`;

  const content = await callGroq(systemPrompt, userPrompt);
  return JSON.parse(content).results;
}

export async function compareComponents(componentIds: string[]) {
  const systemPrompt = `You are a PC hardware comparison expert. Respond ONLY with valid JSON:
{ "comparison": { "components": [{ "name": string, "specs": object, "pros": string[], "cons": string[] }], "winner": string, "verdict": string } }`;

  const userPrompt = `Compare these components: ${componentIds.join(', ')}`;

  const content = await callGroq(systemPrompt, userPrompt);
  return JSON.parse(content).comparison;
}