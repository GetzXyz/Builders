import Groq from 'groq-sdk';
import { BuildRequest, BuildResponse, ComponentSelection } from '@/types/build';
import { buildSystemPrompt, buildUserPrompt } from './prompts';
import { validateBuildResponse, sanitizePrices } from '@/lib/utils/validation';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateBuild(request: BuildRequest): Promise<BuildResponse> {
  try {
    const systemPrompt = buildSystemPrompt(request.region, request.currency);
    const userPrompt = buildUserPrompt(request);

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      temperature: 0.4,
      max_tokens: 4096,
      top_p: 0.9,
      stream: false,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    // Parse and validate the response
    const parsed = JSON.parse(content);
    const validated = validateBuildResponse(parsed);
    const sanitized = sanitizePrices(validated, request.currency);

    return sanitized;
  } catch (error) {
    console.error('Groq API Error:', error);
    throw new Error('Failed to generate build recommendation');
  }
}

export async function searchComponents(query: string, region: string, currency: string) {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: `You are a PC hardware expert. Search for current prices of components in ${region} using ${currency}. Return only valid JSON.`,
        },
        {
          role: 'user',
          content: `Find current prices for: ${query}. Include product name, model, brand, price, and availability.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    });

    const content = completion.choices[0]?.message?.content || '';
    return JSON.parse(content);
  } catch (error) {
    console.error('Search Error:', error);
    throw new Error('Failed to search components');
  }
}

export async function compareComponents(componentIds: string[]) {
  try {
    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content: 'You are a PC hardware expert. Compare components and provide detailed analysis.',
        },
        {
          role: 'user',
          content: `Compare these components: ${componentIds.join(', ')}. Provide performance comparison, value analysis, and recommendations.`,
        },
      ],
      temperature: 0.3,
      max_tokens: 2048,
    });

    const content = completion.choices[0]?.message?.content || '';
    return JSON.parse(content);
  } catch (error) {
    console.error('Compare Error:', error);
    throw new Error('Failed to compare components');
  }
}