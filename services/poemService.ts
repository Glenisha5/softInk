import { PoemRequest, PoemResponse } from "../types";

const API_URL = (import.meta as { env?: { VITE_API_URL?: string } }).env?.VITE_API_URL || "http://localhost:5000";

export const fetchPoemsByLanguage = async (language: string): Promise<PoemResponse[]> => {
  const response = await fetch(`${API_URL}/api/poems/${language}`);

  if (!response.ok) {
    throw new Error(`No poems found for ${language}`);
  }

  return response.json();
};