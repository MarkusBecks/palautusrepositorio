export interface Diary {
  date: string;
  weather: string;
  visibility: string;
  comment: string;
}

export interface ValidationError {
  message: string;
  errors: Record<string, string[]>;
}
