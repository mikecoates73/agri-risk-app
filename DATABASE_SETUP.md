# Database Setup for SWOT Analysis

This guide explains how to set up the Supabase database for saving SWOT analysis results.

## Prerequisites

1. A Supabase project with the following environment variables configured:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (for server-side operations)

## Database Setup

### 1. Run the Migration

Execute the SQL migration in your Supabase SQL editor:

```sql
-- Copy and paste the contents of supabase-migration.sql
```

Or run it via the Supabase CLI:

```bash
supabase db push
```

### 2. Table Structure

The `swot_analyses` table will be created with the following structure:

- `id` (UUID, Primary Key): Unique identifier for each analysis
- `country` (TEXT): The country analyzed
- `crop` (TEXT): The crop analyzed
- `strengths` (TEXT[]): Array of strength points
- `weaknesses` (TEXT[]): Array of weakness points
- `opportunities` (TEXT[]): Array of opportunity points
- `threats` (TEXT[]): Array of threat points
- `created_at` (TIMESTAMP): When the analysis was created
- `updated_at` (TIMESTAMP): When the analysis was last updated

### 3. Environment Variables

Add these to your `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

## Usage

1. Generate a SWOT analysis using the form
2. Click the "Save to Database" button in the results
3. The analysis will be parsed and stored in the database

## Security

- Row Level Security (RLS) is enabled
- The current policy allows all operations (modify based on your auth requirements)
- Service role key is used for server-side operations only

## API Endpoints

- `POST /api/analyze`: Generate SWOT analysis
- `POST /api/save-analysis`: Save analysis to database

## Error Handling

The application includes comprehensive error handling for:
- Database connection issues
- Invalid data formats
- Network errors
- API failures 