import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export async function GET() {
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('faostat_data')
      .select('"Area"')
      .order('"Area"', { ascending: true });

    if (error) {
      console.error('Error fetching FAOSTAT areas:', error);
      return NextResponse.json(
        { error: 'Failed to fetch areas' },
        { status: 500 }
      );
    }

    // Get unique areas
    const uniqueAreas = [...new Set(data.map(row => row.Area))].sort();

    return NextResponse.json({ areas: uniqueAreas });
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 