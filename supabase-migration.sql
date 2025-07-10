-- Create SWOT analyses table
CREATE TABLE IF NOT EXISTS swot_analyses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    country TEXT NOT NULL,
    crop TEXT NOT NULL,
    strengths TEXT[] NOT NULL DEFAULT '{}',
    weaknesses TEXT[] NOT NULL DEFAULT '{}',
    opportunities TEXT[] NOT NULL DEFAULT '{}',
    threats TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_swot_analyses_country ON swot_analyses(country);
CREATE INDEX IF NOT EXISTS idx_swot_analyses_crop ON swot_analyses(crop);
CREATE INDEX IF NOT EXISTS idx_swot_analyses_created_at ON swot_analyses(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE swot_analyses ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all operations (you can modify this based on your auth requirements)
CREATE POLICY "Allow all operations on swot_analyses" ON swot_analyses
    FOR ALL USING (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_swot_analyses_updated_at 
    BEFORE UPDATE ON swot_analyses 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column(); 