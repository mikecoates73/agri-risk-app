import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { FAOSTATFilterRequest, FAOSTATChartData, ChartDataPoint } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const body: FAOSTATFilterRequest = await request.json();
    const { area, item } = body;

    if (!area || !item) {
      return NextResponse.json(
        { error: 'Area and item are required' },
        { status: 400 }
      );
    }

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const { data, error } = await supabase
      .from('faostat_data')
      .select('"Area", "Item", "Year", "Value", "Unit"')
      .eq('"Area"', area)
      .eq('"Item"', item)
      .eq('"Element"', 'Area harvested')
      .not('"Value"', 'is', null)
      .order('"Year"', { ascending: true });

    if (error) {
      console.error('Error fetching FAOSTAT Area harvested data:', error);
      return NextResponse.json(
        { error: 'Failed to fetch data' },
        { status: 500 }
      );
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'No Area harvested data found for the selected area and item' },
        { status: 404 }
      );
    }

    // Transform data for chart
    const chartData: ChartDataPoint[] = data.map(row => ({
      year: row.Year,
      value: row.Value
    }));

    const result: FAOSTATChartData = {
      area: data[0].Area,
      item: data[0].Item,
      unit: data[0].Unit,
      data: chartData
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 