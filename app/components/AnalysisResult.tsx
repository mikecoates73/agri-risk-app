'use client';

import { AnalysisResponse } from '../../types';

interface AnalysisResultProps {
  result: AnalysisResponse;
}

export default function AnalysisResult({ result }: AnalysisResultProps) {
  if (!result.success || !result.analysis) {
    return null;
  }

  // Simple markdown parsing for headers and lists
  const formatMarkdown = (text: string) => {
    return text
      .split('\n')
      .map((line, index) => {
        // Handle headers (## or ###)
        if (line.startsWith('## ')) {
          return (
            <h2 key={index} className="text-xl font-bold text-gray-800 mt-6 mb-3">
              {line.replace('## ', '')}
            </h2>
          );
        }
        if (line.startsWith('### ')) {
          return (
            <h3 key={index} className="text-lg font-semibold text-gray-700 mt-4 mb-2">
              {line.replace('### ', '')}
            </h3>
          );
        }
        // Handle bullet points
        if (line.startsWith('- ') || line.startsWith('* ')) {
          return (
            <li key={index} className="text-gray-600 mb-1">
              {line.replace(/^[-*]\s/, '')}
            </li>
          );
        }
        // Handle numbered lists
        if (/^\d+\.\s/.test(line)) {
          return (
            <li key={index} className="text-gray-600 mb-1">
              {line.replace(/^\d+\.\s/, '')}
            </li>
          );
        }
        // Handle regular paragraphs
        if (line.trim()) {
          return (
            <p key={index} className="text-gray-600 mb-3">
              {line}
            </p>
          );
        }
        // Handle empty lines
        return <div key={index} className="h-2"></div>;
      });
  };

  return (
    <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">SWOT Analysis Results</h2>
      
      <div className="prose prose-sm max-w-none">
        <div className="space-y-4">
          {formatMarkdown(result.analysis)}
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <p className="text-sm text-gray-500">
          Analysis generated using Claude AI. Results are for informational purposes only.
        </p>
      </div>
    </div>
  );
} 