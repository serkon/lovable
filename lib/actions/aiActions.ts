"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export interface Suggestion {
  text: string;
  icon: string;
}

export const fetchBioSuggestions = async (): Promise<Suggestion[]> => {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Generate 9 unique, short, and heartwarming 'About Me' sentence starters in Turkish for a dating/friendship app dedicated to people over 50. 
    Each starter should reflect a hobby, value, or personality trait. 
    Return them as a JSON object with a 'suggestions' array. 
    Each item should have 'text' and a 'icon' (a valid Lucide React icon name in lowercase like 'heart', 'book', 'camera', 'tree-pine', 'utensils', etc.).`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: "application/json",
      },
    });

    const response = await result.response;
    const data = JSON.parse(response.text() || '{"suggestions": []}');
    return data.suggestions;
  } catch (error) {
    console.error("Error fetching suggestions:", error);
    // Fallback static suggestions with Lucide icons
    return [
      { text: "Huzurlu bir hayat süren, doğa aşığı biriyim.", icon: "tree-pine" },
      { text: "Yeni yerler keşfetmeyi severim.", icon: "plane" },
      { text: "Dürüstlük ve güven her şeyden önce gelir.", icon: "shield-check" },
      { text: "Gerçek bir dost ve hayat arkadaşı arıyorum.", icon: "heart" },
      { text: "Mutfakta vakit geçirmeyi ve güzel sofralar severim.", icon: "utensils" },
      { text: "Kitap okumak ve derin sohbetler keyif verir.", icon: "book-open" },
      { text: "Aile değerlerine önem veren biriyim.", icon: "users" },
      { text: "Hayata pozitif bakmayı severim.", icon: "smile" },
      { text: "Sağlık ve zinde kalmak önemlidir.", icon: "activity" },
    ];
  }
};

export async function checkProfilePhoto(imageBuffer: Buffer, mimeType: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Analyze this profile photo for a dating app. 
    Check if:
    1. It is a clear, high-quality image (Good lighting).
    2. It contains exactly one person (Solo shot).
    3. The face is clearly visible (Clear face).
    4. It is appropriate/safe.

    Return a JSON object:
    {
      "isApproved": boolean,
      "score": number (0-100),
      "feedback": {
        "lighting": "good" | "bad",
        "solo": boolean,
        "faceVisible": boolean,
        "message": "Short encouraging message in Turkish"
      }
    }`;

    const result = await model.generateContent([
      prompt,
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType,
        },
      },
    ]);

    const response = await result.response;
    return JSON.parse(response.text());
  } catch (error) {
    console.error("AI Photo check error:", error);
    // Silent fail - return approved to not block user
    return {
      isApproved: true,
      score: 100,
      feedback: { lighting: "good", solo: true, faceVisible: true, message: "" },
    };
  }
}
