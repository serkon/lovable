"use server";

import { GoogleGenAI } from "@google/genai";
import { BioTemplateMetadata } from "@/lib/constants";

export type Suggestion = BioTemplateMetadata;
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export const fetchBioSuggestions = async (
  existingTemplates?: Suggestion[],
  hobbies?: string[],
  language: string = "tr"
): Promise<Suggestion[]> => {
  const categoriesContext = hobbies?.join(", ") || "";

  const prompt = `
Generate profile bio sentences for a dating app.

Goal: Natural self-expressions in first-person singular.
Language: Strictly ${language}.

Rules:
- Generate exactly 9 SHORT and COMPLETE sentences.
- Each sentence MUST be assigned to exactly one category from this list: [${categoriesContext}].
- Avoid starting sentences with the same word (especially "Ben" in Turkish).
- No emojis, no questions, no clichés.

Tone: Warm, human, sincere.

Output format (JSON):
{
  "suggestions": [
    {
      "content": "Cümle buraya",
      "category": "hobby_..." 
    }
  ]
}
`;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      config: {
        responseMimeType: "application/json",
        temperature: 0.8,
      },
    });

    const responseText = await result.text;

    if (!responseText) {
      console.error("AI returned empty text");
      return [];
    }
    const data = JSON.parse(responseText);

    // AI'dan gelen veriyi zenginleştiriyoruz (İkon ekleme)
    return (data.suggestions || []).map((s: Suggestion) => ({
      content: s.content,
      category: s.category,
    }));
  } catch (error) {
    console.error("AI Fetch Error:", error);

    // Fallback logic
    if (existingTemplates?.length) {
      return existingTemplates.slice(0, 9).map(({ content, category }) => ({
        content,
        category,
      }));
    }
    return [];
  }
};

export async function checkProfilePhoto(imageBuffer: Buffer, mimeType: string) {
  try {
    const prompt = `Analyze this profile photo for a dating app. 
    Check lighting, solo person, face visibility, and safety.
    Return JSON: { "isApproved": boolean, "score": number, "feedback": { "message": "Turkish feedback" } }`;

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite",
      contents: [
        {
          role: "user",
          parts: [
            { text: prompt },
            { inlineData: { data: imageBuffer.toString("base64"), mimeType } },
          ],
        },
      ],
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
    console.error("Photo check error:", error);
    // Mimari karar: Hata durumunda onay vermek yerine "manuel inceleme" gerektiren bir yapı dönmek daha güvenlidir.
    return {
      isApproved: false,
      score: 0,
      feedback: { message: "Sistem şu an meşgul, lütfen az sonra tekrar dene." },
    };
  }
}
