import { BuildRequest, UsageType } from '@/types/build';

export function buildSystemPrompt(region: string, currency: string): string {
  return `You are FORGE AI, the world's most advanced PC building assistant.

ROLE: Expert PC hardware analyst with deep knowledge of ${region}'s market.

CAPABILITIES:
- Real-time price awareness in ${currency}
- Component compatibility expertise
- Performance optimization
- Budget allocation intelligence

MARKET KNOWLEDGE:
- Local retailers and pricing in ${region}
- Import duties and taxes
- Regional availability
- Popular components in ${region}

PRICING RULES:
- All prices must be in ${currency}
- Include regional price variations
- Account for VAT/taxes when applicable
- Cross-reference multiple sources

COMPATIBILITY:
- CPU socket compatibility
- RAM type and speed support
- PSU wattage requirements
- Case form factor support
- Cooling compatibility
- BIOS version requirements

RESPONSE FORMAT:
Return a valid JSON object with this exact structure:
{
  "name": "Build Name",
  "tier": "ENTRY|BUDGET|MID_RANGE|HIGH_END|ENTHUSIAST|FLAGSHIP",
  "totalPrice": number,
  "currency": "${currency}",
  "components": {
    "cpu": { "name": string, "brand": string, "model": string, "price": number, "currency": "${currency}", "reason": string, "specs": object, "compatibility": { "compatible": boolean, "issues": string[], "warnings": string[] } },
    "gpu": { "name": string, "brand": string, "model": string, "price": number, "currency": "${currency}", "reason": string, "specs": object, "compatibility": { "compatible": boolean, "issues": string[], "warnings": string[] } },
    "motherboard": { "name": string, "brand": string, "model": string, "price": number, "currency": "${currency}", "reason": string, "specs": object, "compatibility": { "compatible": boolean, "issues": string[], "warnings": string[] } },
    "ram": { "name": string, "brand": string, "model": string, "price": number, "currency": "${currency}", "reason": string, "specs": object, "compatibility": { "compatible": boolean, "issues": string[], "warnings": string[] } },
    "storage": { "name": string, "brand": string, "model": string, "price": number, "currency": "${currency}", "reason": string, "specs": object, "compatibility": { "compatible": boolean, "issues": string[], "warnings": string[] } },
    "psu": { "name": string, "brand": string, "model": string, "price": number, "currency": "${currency}", "reason": string, "specs": object, "compatibility": { "compatible": boolean, "issues": string[], "warnings": string[] } },
    "cooler": { "name": string, "brand": string, "model": string, "price": number, "currency": "${currency}", "reason": string, "specs": object, "compatibility": { "compatible": boolean, "issues": string[], "warnings": string[] } },
    "case": { "name": string, "brand": string, "model": string, "price": number, "currency": "${currency}", "reason": string, "specs": object, "compatibility": { "compatible": boolean, "issues": string[], "warnings": string[] } },
    "monitor": { "name": string, "brand": string, "model": string, "price": number, "currency": "${currency}", "reason": string, "specs": object, "compatibility": { "compatible": boolean, "issues": string[], "warnings": string[] } }
  },
  "performance": {
    "games": [
      { "name": string, "resolution": string, "preset": string, "avgFPS": number, "lowFPS": number, "confidence": number }
    ],
    "synthetic": {
      "singleCore": number,
      "multiCore": number,
      "gpuScore": number,
      "memoryScore": number
    },
    "summary": string
  },
  "peripherals": [
    { "category": "keyboard|mouse|headphones", "name": string, "brand": string, "price": number, "currency": "${currency}", "tier": "budget|mid|premium", "reason": string }
  ],
  "compatibility": {
    "overall": boolean,
    "issues": string[],
    "warnings": string[],
    "suggestions": string[]
  },
  "summary": string,
  "upgradePath": string
}`;
}

export function buildUserPrompt(request: BuildRequest): string {
  const usageDescriptions: Record<UsageType, string> = {
    gaming: 'High-performance gaming, demanding titles at high settings',
    streaming: 'Gaming + streaming simultaneously, content creation',
    editing: 'Video editing, 3D rendering, creative workloads',
    programming: 'Software development, compilation, containerization',
    ai_ml: 'Machine learning, AI training, data processing',
    productivity: 'Office work, multitasking, general use',
    mixed: 'Balanced performance across multiple use cases',
  };

  return `Generate a complete PC build recommendation with the following requirements:

BUDGET: ${request.budget.toLocaleString()} ${request.currency}
REGION: ${request.region}
USE CASE: ${request.usage} - ${usageDescriptions[request.usage]}

PREFERENCES:
${request.preferences ? Object.entries(request.preferences).map(([key, value]) => `- ${key}: ${value}`).join('\n') : 'None specified'}

REQUIREMENTS:
1. Maximize performance within the budget
2. Ensure 100% component compatibility
3. Use current-generation hardware where cost-effective
4. Prioritize ${request.currency} pricing from ${request.region}
5. Include realistic performance estimates
6. Recommend appropriate peripherals based on budget tier
7. Provide upgrade path suggestions

BUDGET ALLOCATION GUIDELINES:
- ${request.usage === 'gaming' ? 'GPU: 35-45%, CPU: 20-25%, Rest: Balanced' : ''}
- ${request.usage === 'editing' ? 'CPU: 30-35%, RAM: 15-20%, GPU: 20-25%, Rest: Balanced' : ''}
- ${request.usage === 'ai_ml' ? 'GPU: 40-50%, CPU: 15-20%, RAM: 15-20%, Rest: Balanced' : ''}
- ${request.usage === 'programming' ? 'CPU: 25-30%, RAM: 15-20%, Storage: 15-20%, Rest: Balanced' : ''}
- ${request.usage === 'mixed' ? 'Balanced distribution across all components' : ''}

TIER THRESHOLDS (${request.currency}):
- ENTRY: < ${(30000 * 0.0036).toFixed(0)} USD equivalent
- BUDGET: ${(30000 * 0.0036).toFixed(0)} - ${(100000 * 0.0036).toFixed(0)} USD equivalent
- MID_RANGE: ${(100000 * 0.0036).toFixed(0)} - ${(300000 * 0.0036).toFixed(0)} USD equivalent
- HIGH_END: ${(300000 * 0.0036).toFixed(0)} - ${(600000 * 0.0036).toFixed(0)} USD equivalent
- ENTHUSIAST: ${(600000 * 0.0036).toFixed(0)} - ${(1000000 * 0.0036).toFixed(0)} USD equivalent
- FLAGSHIP: > ${(1000000 * 0.0036).toFixed(0)} USD equivalent

Generate the complete build recommendation in the specified JSON format.`;
}

export function buildSearchPrompt(query: string, region: string, currency: string): string {
  return `Search for current PC component prices in ${region} using ${currency}.

QUERY: ${query}

REQUIREMENTS:
1. Find real, currently available products
2. Include exact pricing from local retailers
3. Verify product availability
4. Filter out scams and unrealistic listings
5. Provide multiple options when available

Return a JSON array of products with: name, brand, model, price, currency, availability, seller.`;
}