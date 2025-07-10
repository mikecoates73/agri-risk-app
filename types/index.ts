export interface AnalysisRequest {
  country: string;
  crop: string;
}

export interface AnalysisResponse {
  analysis: string;
  success: boolean;
  error?: string;
}

export interface SWOTAnalysis {
  id?: string;
  country: string;
  crop: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  created_at?: string;
  user_id?: string;
}

export interface SaveAnalysisRequest {
  country: string;
  crop: string;
  analysis: string;
}

export interface SaveAnalysisResponse {
  success: boolean;
  id?: string;
  error?: string;
} 