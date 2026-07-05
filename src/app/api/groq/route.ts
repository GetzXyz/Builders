import { NextRequest, NextResponse } from 'next/server';
import {
  generateBuild, generateBuildV2, estimatePerformance,
  searchComponents, compareComponents,
} from '@/lib/ai/groq';
import { BuildRequest } from '@/types/build';
import { rateLimit } from '@/lib/utils/rateLimit';
import { validateBudget } from '@/lib/currency/rates';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    if (await rateLimit(ip)) {
      return NextResponse.json({ error: 'Too many requests. Please try again later.' }, { status: 429 });
    }

    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'recommend_v2': {
        const check = await validateBudget(params.budget, params.currency);
        if (!check.ok) {
          return NextResponse.json(
            { error: check.message, code: check.code, minBudgetInCurrency: check.minBudgetInCurrency ?? null },
            { status: 422 }
          );
        }
        const req: BuildRequest = {
          budget: params.budget,
          currency: String(params.currency).toUpperCase(),
          region: params.region,
          usage: params.usage,
        };
        const build = await generateBuildV2(req);
        return NextResponse.json({ build, budgetPKR: check.budgetPKR });
      }

      case 'performance': {
        if (!Array.isArray(params.parts) || params.parts.length === 0) {
          return NextResponse.json({ error: 'parts array is required' }, { status: 400 });
        }
        const report = await estimatePerformance(params.parts, params.resolution || '1080p');
        return NextResponse.json({ report });
      }

      case 'recommend': {
        const check = await validateBudget(params.budget, params.currency);
        if (!check.ok) {
          return NextResponse.json(
            { error: check.message, code: check.code, minBudgetInCurrency: check.minBudgetInCurrency ?? null },
            { status: 422 }
          );
        }
        const req: BuildRequest = {
          budget: params.budget,
          currency: String(params.currency).toUpperCase(),
          region: params.region,
          usage: params.usage,
          preferences: params.preferences,
        };
        const build = await generateBuild(req);
        return NextResponse.json({ build, budgetPKR: check.budgetPKR });
      }

      case 'search': {
        const results = await searchComponents(params.query, params.region, params.currency);
        return NextResponse.json({ results });
      }

      case 'compare': {
        const comparison = await compareComponents(params.componentIds);
        return NextResponse.json({ comparison });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Internal server error' },
      { status: 500 }
    );
  }
}