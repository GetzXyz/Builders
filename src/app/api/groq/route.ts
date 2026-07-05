import { NextRequest, NextResponse } from 'next/server';
import { generateBuild, searchComponents, compareComponents } from '@/lib/ai/groq';
import { BuildRequest } from '@/types/build';
import { rateLimit } from '@/lib/utils/rateLimit';
import { validateBudget } from '@/lib/currency/rates';

export async function POST(request: NextRequest) {
  try {
    const ip = request.headers.get('x-forwarded-for') || 'unknown';
    const isRateLimited = await rateLimit(ip);
    if (isRateLimited) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { action, ...params } = body;

    switch (action) {
      case 'recommend': {
        const budgetCheck = await validateBudget(params.budget, params.currency);
        if (!budgetCheck.ok) {
          return NextResponse.json(
            {
              error: budgetCheck.message,
              code: budgetCheck.code,
              minBudgetInCurrency: budgetCheck.minBudgetInCurrency ?? null,
            },
            { status: 422 }
          );
        }

        const buildRequest: BuildRequest = {
          budget: params.budget,
          currency: String(params.currency).toUpperCase(),
          region: params.region,
          usage: params.usage,
          preferences: params.preferences,
        };
        const build = await generateBuild(buildRequest);
        return NextResponse.json({ build, budgetPKR: budgetCheck.budgetPKR });
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