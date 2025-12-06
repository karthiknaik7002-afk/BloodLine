import { GoogleGenAI, Type } from "@google/genai";
import { PredictionData } from "../types";

const apiKey = process.env.API_KEY;

export const getBloodDemandForecast = async (): Promise<PredictionData[]> => {
  if (!apiKey) {
    console.warn("API Key missing, returning mock data");
    return getMockPrediction();
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Generate a realistic 7-day blood demand vs supply forecast for a metropolitan hospital network. Return JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING, description: "Day of the week (e.g., Mon)" },
              demand: { type: Type.INTEGER, description: "Projected demand units (0-100)" },
              supply: { type: Type.INTEGER, description: "Projected supply units (0-100)" }
            }
          }
        }
      }
    });

    const text = response.text;
    if (!text) return getMockPrediction();
    
    return JSON.parse(text) as PredictionData[];

  } catch (error) {
    console.error("Gemini API Error:", error);
    return getMockPrediction();
  }
};

const getMockPrediction = (): PredictionData[] => [
  { day: 'Mon', demand: 45, supply: 60 },
  { day: 'Tue', demand: 50, supply: 55 },
  { day: 'Wed', demand: 65, supply: 50 },
  { day: 'Thu', demand: 70, supply: 40 },
  { day: 'Fri', demand: 80, supply: 45 },
  { day: 'Sat', demand: 55, supply: 60 },
  { day: 'Sun', demand: 40, supply: 70 },
];
