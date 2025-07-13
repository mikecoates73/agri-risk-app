# Agricultural Risk Analysis App

A comprehensive web application that generates risk analysis for agricultural crops in specific countries using AI-powered insights, weather data, and market statistics.

## Features

- **Authentication**: Secure user authentication with Supabase
- **Protected Routes**: Access control for authenticated users only
- **Simple Form**: Country and crop inputs for SWOT analysis
- **AI Integration**: Integration with Anthropic's Claude API
- **Weather Data**: Current weather information for selected countries
- **Agricultural Statistics**: World Bank data integration
- **Markdown Display**: Formatted SWOT analysis results
- **Responsive Design**: Works on web and mobile devices
- **Real-time Validation**: Form validation with immediate feedback
- **Loading States**: Smooth user experience with loading indicators
- **Error Handling**: Comprehensive error management

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Authentication**: Supabase Auth
- **AI Integration**: Anthropic Claude API
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Anthropic API key
- OpenWeather API key (optional, for weather data)

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd agri-risk-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file in the project root:
```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
OPENWEATHER_API_KEY=your_openweather_api_key_here
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Usage

1. Enter a country name (e.g., "United States", "India", "Brazil")
2. Enter a crop name (e.g., "Corn", "Rice", "Wheat")
3. Click "Generate SWOT Analysis"
4. View the AI-generated SWOT analysis results

## Project Structure

```
agri-risk-app/
├── app/
│   ├── api/
│   │   └── analyze/
│   │       └── route.ts          # API endpoint for SWOT analysis
│   ├── components/
│   │   ├── AnalysisForm.tsx      # Main form component
│   │   └── AnalysisResult.tsx    # Results display component
│   ├── page.tsx                  # Main page
│   └── layout.tsx                # App layout
├── types/
│   └── index.ts                  # TypeScript interfaces
└── package.json
```

## API Integration

The app uses Anthropic's Claude API to generate SWOT analyses. The API endpoint:

- **URL**: `/api/analyze`
- **Method**: POST
- **Body**: `{ country: string, crop: string }`
- **Response**: `{ analysis: string, success: boolean, error?: string }`

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variable `ANTHROPIC_API_KEY` in Vercel dashboard
4. Deploy automatically on git push

### Manual Deployment

```bash
npm run build
npm start
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

### Code Quality

- TypeScript for type safety
- ESLint for code linting
- Tailwind CSS for styling
- Responsive design principles
- Accessibility best practices

## Troubleshooting

### Common Issues

1. **API Key Error**: Ensure `ANTHROPIC_API_KEY` is set in `.env.local`
2. **Build Errors**: Clear `.next` folder and reinstall dependencies
3. **Styling Issues**: Check Tailwind CSS configuration
4. **Type Errors**: Run `npm run build` to check TypeScript errors

### Environment Variables

Make sure to set the following environment variables:

- `ANTHROPIC_API_KEY`: Your Anthropic API key for Claude AI access
- `OPENWEATHER_API_KEY`: Your OpenWeather API key for weather data (optional)
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For support, please open an issue in the GitHub repository or contact the development team.
