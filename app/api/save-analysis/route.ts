import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { SaveAnalysisRequest, SaveAnalysisResponse } from '../../../types';
import { parseSWOTAnalysis } from '../../../lib/swot-parser';

// Create Supabase client for server-side operations
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for server-side operations
);

export async function POST(request: NextRequest) {
  try {
    const body: SaveAnalysisRequest = await request.json();
    
    // Validate request
    if (!body.country || !body.item || !body.analysis) {
      return NextResponse.json(
        { success: false, error: 'Country, item, and analysis are required' },
        { status: 400 }
      );
    }

    // Parse the SWOT analysis from markdown
    const swotData = parseSWOTAnalysis(body.analysis, body.country, body.item);
    
    // Insert into Supabase
    const { data, error } = await supabase
      .from('swot_analyses')
      .insert({
        country: swotData.country,
        item: swotData.item,
        strengths: swotData.strengths,
        weaknesses: swotData.weaknesses,
        opportunities: swotData.opportunities,
        threats: swotData.threats,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { success: false, error: 'Failed to save analysis to database' },
        { status: 500 }
      );
    }

    const response: SaveAnalysisResponse = {
      success: true,
      id: data.id,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('API Error:', error);
    
    const response: SaveAnalysisResponse = {
      success: false,
      error: error instanceof Error ? error.message : 'An unexpected error occurred',
    };

    return NextResponse.json(response, { status: 500 });
  }
} 