# Agricultural SWOT Analysis App

A simple web application that generates SWOT (Strengths, Weaknesses, Opportunities, Threats) analysis for agricultural crops in specific countries using Claude AI.

## Features

- Simple form with country and crop inputs
- Integration with Anthropic's Claude API
- Markdown-formatted SWOT analysis display
- Responsive design for web and mobile
- Real-time form validation
- Loading states and error handling

## Tech Stack

- **Frontend**: Next.js 14 with App Router
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **AI Integration**: Anthropic Claude API
- **Deployment**: Vercel (recommended)

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Anthropic API key

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
