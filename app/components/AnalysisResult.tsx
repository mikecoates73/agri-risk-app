'use client';

import { useState } from 'react';
import { AnalysisResponse, SaveAnalysisRequest } from '../../types';

interface AnalysisResultProps {
  result: AnalysisResponse;
  country: string;
  crop: string;
}

export default function AnalysisResult({ result, country, crop }: AnalysisResultProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveMessage, setSaveMessage] = useState('');

  if (!result.success || !result.analysis) {
    return null;
  }

  const handleSaveToDatabase = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    setSaveMessage('');

    try {
      const saveRequest: SaveAnalysisRequest = {
        country,
        crop,
        analysis: result.analysis,
      };

      const response = await fetch('/api/save-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(saveRequest),
      });

      const saveResult = await response.json();

      if (saveResult.success) {
        setSaveStatus('success');
        setSaveMessage('Analysis saved successfully!');
      } else {
        setSaveStatus('error');
        setSaveMessage(saveResult.error || 'Failed to save analysis');
      }
    } catch (error) {
      setSaveStatus('error');
      setSaveMessage('An error occurred while saving');
    } finally {
      setIsSaving(false);
    }
  };

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

  const getSaveButtonClass = () => {
    if (isSaving) return 'bg-gray-400 cursor-not-allowed';
    if (saveStatus === 'success') return 'bg-green-600 hover:bg-green-700';
    if (saveStatus === 'error') return 'bg-red-600 hover:bg-red-700';
    return 'bg-blue-600 hover:bg-blue-700';
  };

  const getSaveButtonText = () => {
    if (isSaving) return 'Saving...';
    if (saveStatus === 'success') return 'Saved!';
    if (saveStatus === 'error') return 'Retry Save';
    return 'Save to Database';
  };

  return (
    <div className="mt-8 p-6 bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800">SWOT Analysis Results</h2>
        <button
          onClick={handleSaveToDatabase}
          disabled={isSaving}
          className={`px-4 py-2 text-white font-medium rounded-lg transition-colors ${getSaveButtonClass()}`}
        >
          {getSaveButtonText()}
        </button>
      </div>
      
      {saveMessage && (
        <div className={`mb-4 p-3 rounded-lg ${
          saveStatus === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-red-100 text-red-800 border border-red-200'
        }`}>
          {saveMessage}
        </div>
      )}
      
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