
export interface GroundingSource {
  uri: string;
  title: string;
}

export interface QAHistoryItem {
  id: string;
  question: string;
  answer: string;
  sources: GroundingSource[];
  timestamp: Date;
}

export interface GeminiResponse {
  text: string;
  sources: GroundingSource[];
}
