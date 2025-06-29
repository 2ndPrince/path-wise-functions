// vertex.ts
import {GoogleGenAI, HarmCategory, HarmBlockThreshold} from "@google/genai";

const ai = new GoogleGenAI({
  vertexai: true,
  project: "path-wise-792e5",
  location: "global",
});

const model = "gemini-2.5-flash";

const tools = [
  {
    retrieval: {
      vertexRagStore: {
        ragResources: [
          {
            ragCorpus: "projects/830896169062/locations/us-central1/ragCorpora/6917529027641081856",
          },
        ],
        similarityTopK: 20,
      },
    },
  },
];

const generationConfig = {
  maxOutputTokens: 65535,
  temperature: 1,
  topP: 1,
  seed: 0,
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_NONE,
    },
  ],
  tools: tools,
};

/**
 * Sends a prompt to Vertex AI and returns the generated response as a string.
 *
 * @param {string} message - The user input message to send to the model.
 * @return {Promise<string>} The generated response text.
 */
export async function generateFromVertex(message: string): Promise<string> {
  const chat = ai.chats.create({
    model: model,
    config: generationConfig,
  });

  const response = await chat.sendMessageStream({
    message: [{text: message}],
  });

  let finalResponse = "";

  for await (const chunk of response) {
    if (chunk.text) {
      finalResponse += chunk.text;
    }
  }

  return finalResponse;
}
