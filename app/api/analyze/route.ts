import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { AnalysisRequest, AnalysisResponse } from '../../../types';

// Debug: Check if API key is available
console.log('ANTHROPIC_API_KEY exists:', !!process.env.ANTHROPIC_API_KEY);
console.log('ANTHROPIC_API_KEY length:', process.env.ANTHROPIC_API_KEY?.length || 0);

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY is not set');
      return NextResponse.json(
        { success: false, error: 'API key not configured. Please check your .env.local file.' },
        { status: 500 }
      );
    }

    const body: AnalysisRequest = await request.json();
    
    // Validate request
    if (!body.country || !body.crop) {
      return NextResponse.json(
        { success: false, error: 'Country and crop are required' },
        { status: 400 }
      );
    }

    // Format prompt as specified in PRD
    const prompt = `Please provide a brief SWOT analysis of ${body.crop} in ${body.country} and return in markdown, each with a header for SWOT and 3-5 bullet points for each SWOT category`;

    const message = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    const analysis = message.content[0].type === 'text' ? message.content[0].text : '';

    const response: AnalysisResponse = {
      analysis,
      success: true,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    
    const response: AnalysisResponse = {
      analysis: '',
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };

    return NextResponse.json(response, { status: 500 });
  }
} 