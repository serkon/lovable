"use server";

import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Suggestion {
  text: string;
  icon: string;
}

export const fetchBioSuggestions = async (existingTemplates?: string[]): Promise<Suggestion[]> => {
  console.log("##### GEMINI_API_KEY present:", process.env.GEMINI_API_KEY);
  try {
    const prompt = `
You are generating profile bio sentences for a dating and friendship app.

Goal:
Help users express themselves naturally during signup with zero writing effort.

Language:
Generate all output strictly in {{LANGUAGE}}.

Critical linguistic rule:
- Write in first person singular.
- Follow natural sentence patterns of native speakers in {{LANGUAGE}}.
- If the language commonly omits the subject (e.g. Turkish, Spanish, Italian), do NOT repeatedly start sentences with the explicit subject.
- Avoid starting multiple sentences with the same word or structure.
- Use the explicit subject ("I", "Ben", "Ich", etc.) only when it sounds natural in that language.

Instructions:
- Generate exactly 9 SHORT but COMPLETE sentences.
- Each sentence must be ready to paste directly into a dating profile.
- Sentences must sound like natural self-descriptions, not written profiles.
- Do NOT ask questions.
- Do NOT use emojis.
- Avoid clichés and generic motivational phrases.

Content guidance:
Each sentence should subtly express at least one of:
- personality trait
- value
- lifestyle habit
- interest that invites conversation

Tone:
Warm, sincere, human.
Not poetic.
Not exaggerated.
Not salesy.

Output format (JSON only):
{
  "suggestions": [
    {
      "text": "...",
      "icon": "valid_material_icon_name"
    }
  ]
}

Icon rules:
- Icons should symbolically match the meaning of the sentence.
- Use valid Material Design icon names only.
`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.9, // Higher temperature for more variety
      },
    });

    const response = await result.text;
    if (!response) {
      console.error("AI returned empty text");
      return [];
    }

    try {
      const data = JSON.parse(response);
      console.log("AI response:", data);
      return data.suggestions || [];
    } catch (parseErr) {
      console.error("AI JSON parse error:", parseErr, "Text:", response);
      return [];
    }
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);

    // Fallback: Use existingTemplates (DB templates) if AI fails
    if (existingTemplates && existingTemplates.length > 0) {
      const icons = [
        "heart",
        "sparkles",
        "smile",
        "camera",
        "sun",
        "user",
        "book-open",
        "tree-pine",
        "coffee",
        "music",
        "star",
        "brain",
      ];

      return existingTemplates
        .sort(() => 0.5 - Math.random()) // Shuffle
        .slice(0, 9)
        .map((text, i) => ({
          text,
          icon: icons[i % icons.length],
        }));
    }

    return [];
  }
};

export async function checkProfilePhoto(imageBuffer: Buffer, mimeType: string) {
  try {
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

    const result = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType,
        },
      },
    });

    const response = await result.text;
    if (!response) {
      console.error("AI returned empty text");
      return [];
    }

    try {
      const data = JSON.parse(response);
      console.log("AI response:", data);
      return data;
    } catch (parseErr) {
      console.error("AI JSON parse error:", parseErr, "Text:", response);
      return [];
    }
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
