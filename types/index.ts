export interface AnalysisRequest {
  country: string;
  item: string;
}

export interface FAOSTATItem {
  id: number;
  "Item Code (FAO)": number;
  "Item": string;
}

export interface WorldBankStats {
  agriculturalLand: string;
  cerealYield: string;
  ruralPopulation: string;
  agriculturalValueAdded: string;
}



export interface TradingEconomicsStats {
  commodityPrice: string;
  inflationRate: string;
  gdpGrowth: string;
  exchangeRate: string;
  interestRate: string;
}

export interface NASAImagery {
  imageUrl: string;
  acquisitionDate: string;
  coverage: string;
  resolution: string;
  description: string;
  layer: string;
}

export interface WeatherData {
  temperature: string;
  description: string;
  humidity: string;
  windSpeed: string;
  location: string;
}

export interface AnalysisResponse {
  analysis: string;
  success: boolean;
  error?: string;
  worldBankStats?: WorldBankStats;

  tradingEconomicsStats?: TradingEconomicsStats;
  nasaImagery?: NASAImagery;
  weatherData?: WeatherData;
}

export interface SWOTAnalysis {
  id?: string;
  country: string;
  item: string;
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
  created_at?: string;
  user_id?: string;
}

export interface SaveAnalysisRequest {
  country: string;
  item: string;
  analysis: string;
}

export interface SaveAnalysisResponse {
  success: boolean;
  id?: string;
  error?: string;
}

export interface FAOSTATData {
  id: number;
  "Domain Code": string;
  "Domain": string;
  "Area Code (M49)": number;
  "Area": string;
  "Element Code": number;
  "Element": string;
  "Item Code (FAO)": number;
  "Item": string;
  "Year Code": number;
  "Year": number;
  "Unit": string;
  "Value": number | null;
  "Flag": string | null;
  "Flag Description": string | null;
  created_at?: string;
}

export interface ChartDataPoint {
  year: number;
  value: number;
}

export interface FAOSTATChartData {
  area: string;
  item: string;
  unit: string;
  data: ChartDataPoint[];
}

export interface FAOSTATFilterRequest {
  area: string;
  item: string;
}

 