export interface AnalysisRequest {
  country: string;
  crop: string;
}

export interface AnalysisResponse {
  analysis: string;
  success: boolean;
  error?: string;
} 