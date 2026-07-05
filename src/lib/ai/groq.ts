import {
  BuildRequest, BuildResponse, BuildV2, PerformanceReport,
} from '@/types/build';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const MODEL = 'llama-3.3-70b-versatile';

async function callGroq(systemPrompt: string, userPrompt: string, temperature = 0.6): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not configured');

  const res = await fetch(GROQ_API_URL, {
    method: 'POST',
    headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature,
      response_format: { type: 'json_object' },
    }),
  });

  if (!res.ok) throw new Error(`Groq API error ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const content = data.choices?.[0]?.message?.content;
  if (!content) throw new Error('Empty response from Groq API');
  return content;
}

/* ===== Engine v2: three options per slot ===== */

export async function generateBuildV2(request: BuildRequest): Promise<BuildV2> {
  const systemPrompt = `You are a veteran PC builder with 15 years of market experience, including the used/second-hand market. Respond ONLY with valid JSON, exactly this shape:
{
  "id": string, "name": string, "tier": string, "currency": string,
  "slots": [
    {
      "category": "cpu",
      "options": [
        { "name": string, "brand": string, "condition": "new" or "used", "price": number, "currency": string, "reason": string, "wattage": number, "riskRating": "low"|"medium"|"high" (only for used) }
      ],
      "selectedIndex": 0
    }
  ],
  "totalPrice": number,
  "compatibility": { "overall": boolean, "issues": string[], "warnings": string[], "suggestions": string[] },
  "summary": string
}
STRICT RULES:
- Exactly 8 slots, in this order: cpu, gpu, motherboard, ram, storage, psu, case, cooler.
- Exactly 3 options per slot. Different models; use different brands where sensible (e.g. NVIDIA vs AMD GPU, Intel vs AMD CPU when the motherboard slot options cover both platforms sensibly).
- Mix new and used: when budget is tight, at least one used option per expensive slot (gpu, cpu). Every used option needs riskRating and its reason must mention typical age and what to inspect.
- Prices: realistic current market prices in the requested currency for the requested region.
- selectedIndex marks your recommended option (best value). The sum of all selected option prices must be <= the budget and within 90-100% of it (use the budget well).
- ALL options within a slot must be compatible with the selected options of other slots (socket, wattage, clearance, RAM generation).
- Each option's "reason" is one sharp sentence: why this part, for whom.
- totalPrice = exact sum of selected option prices.`;

  const userPrompt = `Build for:
- Budget: ${request.budget} ${request.currency} (hard ceiling)
- Region: ${request.region}
- Primary usage: ${request.usage}`;

  const content = await callGroq(systemPrompt, userPrompt);
  return JSON.parse(content) as BuildV2;
}

/* ===== Performance report: 10 games + 5 professional tools ===== */

const GAMES_LIST = [
  'Cyberpunk 2077', 'Black Myth: Wukong', 'Call of Duty: Warzone', 'Fortnite',
  'Counter-Strike 2', 'Valorant', 'PUBG: Battlegrounds', 'Forza Horizon 5',
  'Red Dead Redemption 2', 'Marvel Rivals',
];

const SOFTWARE_LIST = [
  'Blender (3D rendering)', 'Adobe Premiere Pro (video editing)', 'Unreal Engine 5 (game development)',
  'Visual Studio (large project builds)', 'DaVinci Resolve (color grading)',
];

export async function estimatePerformance(
  parts: { category: string; name: string }[],
  resolution: string = '1080p'
): Promise<PerformanceReport> {
  const systemPrompt = `You are a hardware benchmarking analyst with deep knowledge of published benchmark data. Respond ONLY with valid JSON:
{
  "games": [ { "name": string, "resolution": string, "preset": string, "avgFPS": number, "low1": number } ],
  "software": [ { "name": string, "score": number, "tier": "Entry"|"Capable"|"Professional"|"Workstation", "note": string } ],
  "summary": string
}
RULES:
- "games": exactly these 10, in order: ${GAMES_LIST.join('; ')}. Use resolution "${resolution}", preset "High". avgFPS and low1 (1% low) must be realistic for the given hardware, grounded in real published benchmarks. low1 is always below avgFPS.
- "software": exactly these 5, in order: ${SOFTWARE_LIST.join('; ')}. score is 0-100 relative to a current high-end workstation (100 = flagship-class). tier maps score: 0-40 Entry, 41-65 Capable, 66-85 Professional, 86-100 Workstation. note = one sentence on real-world experience.
- "summary": two sentences, honest overall verdict.`;

  const userPrompt = `Hardware:\n${parts.map((p) => `- ${p.category}: ${p.name}`).join('\n')}`;

  const content = await callGroq(systemPrompt, userPrompt, 0.4);
  return JSON.parse(content) as PerformanceReport;
}

/* ===== Legacy v1 functions (current builder page - replaced in R3) ===== */

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

  const content = await callGroq(systemPrompt, userPrompt, 0.7);
  return JSON.parse(content) as BuildResponse;
}

export async function searchComponents(query: string, region: string, currency: string) {
  const systemPrompt = `You are a PC component search engine. Respond ONLY with valid JSON:
{ "results": [{ "name": string, "brand": string, "category": string, "price": number, "currency": string, "specs": object, "reason": string }] }
Return up to 8 relevant components with realistic current prices for the given region and currency.`;
  const content = await callGroq(systemPrompt, `Search for: "${query}" (region: ${region}, currency: ${currency})`);
  return JSON.parse(content).results;
}

export async function compareComponents(componentIds: string[]) {
  const systemPrompt = `You are a PC hardware comparison expert. Respond ONLY with valid JSON:
{ "comparison": { "components": [{ "name": string, "specs": object, "pros": string[], "cons": string[] }], "winner": string, "verdict": string } }`;
  const content = await callGroq(systemPrompt, `Compare these components: ${componentIds.join(', ')}`);
  return JSON.parse(content).comparison;
}