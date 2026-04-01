import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export interface Stakeholder {
  name: string;
  role: string;
}

export interface AgendaItem {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  owner: string;
}

export interface MeetingAgenda {
  title: string;
  goal: string;
  stakeholders: Stakeholder[];
  agenda: AgendaItem[];
}

export const generateAgenda = async (
  input: { base64?: string; mimeType?: string; text?: string }
): Promise<MeetingAgenda> => {
  const model = "gemini-3-flash-preview";
  
  const prompt = `Analyze the provided document and generate a structured meeting agenda. 
  Extract the meeting title, the primary goal, the key stakeholders involved, and a detailed list of agenda topics.
  For each topic, provide a title, a brief description, the estimated duration in minutes, and the owner/lead for that topic.
  
  Return the result in JSON format matching this schema:
  {
    "title": "string",
    "goal": "string",
    "stakeholders": [{ "name": "string", "role": "string" }],
    "agenda": [{ "id": "string", "title": "string", "description": "string", "duration": number, "owner": "string" }]
  }`;

  const parts: any[] = [{ text: prompt }];

  if (input.text) {
    parts.push({ text: `Document Content:\n${input.text}` });
  } else if (input.base64 && input.mimeType) {
    parts.push({ inlineData: { data: input.base64, mimeType: input.mimeType } });
  }

  const response = await ai.models.generateContent({
    model,
    contents: [{ parts }],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          goal: { type: Type.STRING },
          stakeholders: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING },
                role: { type: Type.STRING }
              },
              required: ["name", "role"]
            }
          },
          agenda: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                duration: { type: Type.NUMBER },
                owner: { type: Type.STRING }
              },
              required: ["id", "title", "description", "duration", "owner"]
            }
          }
        },
        required: ["title", "goal", "stakeholders", "agenda"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as MeetingAgenda;
};

export const chatWithAgenda = async (history: any[], message: string, agenda: MeetingAgenda) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: `You are an expert meeting facilitator. You are helping the user refine a meeting agenda based on an uploaded document.
      Current Agenda: ${JSON.stringify(agenda)}
      
      Help the user adjust timings, add topics, or refine stakeholder roles. Be concise and professional.`,
    }
  });

  // Convert history to Gemini format
  const contents = history.map(h => ({
    role: h.role === 'user' ? 'user' : 'model',
    parts: [{ text: h.content }]
  }));

  const response = await chat.sendMessage({ message });
  return response.text;
};
