import { SWOTAnalysis } from '../types';

export function parseSWOTAnalysis(analysis: string, country: string, crop: string): SWOTAnalysis {
  const lines = analysis.split('\n').map(line => line.trim()).filter(line => line.length > 0);
  
  let strengths: string[] = [];
  let weaknesses: string[] = [];
  let opportunities: string[] = [];
  let threats: string[] = [];
  
  let currentSection: 'strengths' | 'weaknesses' | 'opportunities' | 'threats' | null = null;
  
  for (const line of lines) {
    const lowerLine = line.toLowerCase();
    
    // More comprehensive section detection
    if (lowerLine.includes('strength') || lowerLine.includes('## strength') || lowerLine.includes('### strength')) {
      currentSection = 'strengths';
      continue;
    } else if (lowerLine.includes('weakness') || lowerLine.includes('## weakness') || lowerLine.includes('### weakness')) {
      currentSection = 'weaknesses';
      continue;
    } else if (
      lowerLine.includes('opportunity') || 
      lowerLine.includes('## opportunity') || 
      lowerLine.includes('### opportunity') ||
      lowerLine.includes('opportunities') || 
      lowerLine.includes('## opportunities') || 
      lowerLine.includes('### opportunities')
    ) {
      currentSection = 'opportunities';
      continue;
    } else if (
      lowerLine.includes('threat') || 
      lowerLine.includes('## threat') || 
      lowerLine.includes('### threat') ||
      lowerLine.includes('threats') || 
      lowerLine.includes('## threats') || 
      lowerLine.includes('### threats')
    ) {
      currentSection = 'threats';
      continue;
    }
    
    // Parse bullet points - expanded to handle more formats
    if (currentSection && (
      line.startsWith('- ') || 
      line.startsWith('* ') || 
      line.startsWith('• ') ||
      /^\d+\.\s/.test(line) ||
      /^[a-z]\.\s/.test(line)
    )) {
      const content = line
        .replace(/^[-*•]\s/, '')  // Remove bullet points
        .replace(/^\d+\.\s/, '')  // Remove numbered lists
        .replace(/^[a-z]\.\s/, '') // Remove lettered lists
        .trim();
      
      if (content) {
        switch (currentSection) {
          case 'strengths':
            strengths.push(content);
            break;
          case 'weaknesses':
            weaknesses.push(content);
            break;
          case 'opportunities':
            opportunities.push(content);
            break;
          case 'threats':
            threats.push(content);
            break;
        }
      }
    }
  }
  
  return {
    country,
    crop,
    strengths,
    weaknesses,
    opportunities,
    threats,
  };
} 