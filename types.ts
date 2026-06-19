
export type Language = 'English' | 'Hindi';

export interface Genre {
  id: string;
  name: string;
  hindiName?: string;
  description: string;
  image: string;
}

export interface PoemRequest {
  language: Language;
  genre: string;
  prompt?: string;
}

export interface PoemResponse {
  title: string;
  content: string;
  author: string;
  meaning?: string;
}

export interface PoemsData {
  english: Record<string, PoemResponse[]>;
  hindi: Record<string, PoemResponse[]>;
}
