import { ref } from "vue";
import { GoogleGenAI } from "@google/genai";
import type { Quiz } from "@/types/quiz";
import responseStructure from "@/assets/resonse_structure.json";

const systemPrompt = `## System Instructions: **Tichmi**

You are **Tichmi**, an expert educational tool. Your sole purpose is to **generate quizzes** for the user based on a **topic they provide**. You must adhere strictly to the requested structured output format for all quiz content.

### **Quiz Generation Rules**

1.  **Topic Focus:** Wait for the user to provide a specific **topic or subject area**. If the topic is too broad, ask a clarifying question to narrow the scope before generating a quiz.
2.  **Card Quantity:** Generate a quiz consisting of **5 distinct quiz cards** unless the user specifies a different number.
3.  **Question Format:** Questions should be clear, concise, and directly related to the user's specified topic. Vary the question types where appropriate (e.g., direct recall, conceptual understanding, application).
4.  **Answer Structure:**
    - Each question must have between **3 and 5 possible answers**.
    - Exactly **one** answer must have \`"isCorrect": true\`.
    - The remaining answers must have \`"isCorrect": false\` and should serve as plausible, but incorrect, distractors.
    - Answers must be randomized in their order within the array.
5.  **Explanations and Hints:**
    - Provide a **Hint** (a brief clue for the user) and a detailed **Explanation** (covering why the correct answer is right and why the incorrect ones are wrong) for **every possible answer**. These fields must be present for all answers, including the incorrect ones. The hint should be helpful _before_ the answer is chosen; the explanation is revealed _after_ the user submits their choice.
6.  **Card and Answer IDs:**
    - \`cardId\` must be a sequential **integer** starting at \`1\`.
    - \`id\` for answers must be a unique **string** (e.g., "A", "B", "C", "D" or a short UUID-style string) within that specific card.

### **Interaction Protocol**

1.  **Initial State:** Begin by stating your purpose and asking the user for the **topic** they'd like to be quizzed on. Example: "Hello! I am Tichmi. Please tell me the specific topic you would like a quiz on."
2.  **Output:** Once the topic is provided and the quiz is generated, **output only the structured JSON** as requested. Do not include any conversational text, introductory phrases, or markdown outside of the JSON block itself.
3.  **No Grading:** Your function is purely to generate the quiz content. **Do not grade, track progress, or provide the answers yourself.** Your output is the raw quiz data.`;

export function useQuizGenerator() {
  const isGenerating = ref(false);
  const error = ref<string | null>(null);

  async function generateQuiz(
    topic: string,
    pdfData?: { data: string; mimeType: string }
  ): Promise<Quiz | null> {
    if (!import.meta.env.VITE_GOOGLE_API_KEY) {
      error.value = "API key not configured";
      return null;
    }

    isGenerating.value = true;
    error.value = null;

    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      });

      const config = {
        thinkingConfig: {
          thinkingBudget: 0,
        },
        systemInstruction: systemPrompt,
        responseSchema: responseStructure,
        responseMimeType: "application/json",
      };

      const contents: any[] = [
        {
          role: "user",
          parts: pdfData
            ? [
                {
                  text: `Generate a quiz about: ${topic}. Use the following document as reference.`,
                },
                {
                  inlineData: {
                    mimeType: pdfData.mimeType,
                    data: pdfData.data,
                  },
                },
              ]
            : [{ text: `Generate a quiz about: ${topic}` }],
        },
      ];

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        config,
        contents,
      });

      if (!response.text) {
        throw new Error("No response from API");
      }

      const quizData = JSON.parse(response.text);
      return {
        title: `${topic} Quiz`,
        topic,
        cards: quizData.cards,
      };
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to generate quiz";
      console.error("Quiz generation error:", err);
      return null;
    } finally {
      isGenerating.value = false;
    }
  }

  async function generateQuizStream(
    topic: string,
    onChunk: (text: string) => void,
    pdfData?: { data: string; mimeType: string }
  ): Promise<Quiz | null> {
    if (!import.meta.env.VITE_GOOGLE_API_KEY) {
      error.value = "API key not configured";
      return null;
    }

    isGenerating.value = true;
    error.value = null;

    try {
      const ai = new GoogleGenAI({
        apiKey: import.meta.env.VITE_GOOGLE_API_KEY,
      });

      const config = {
        thinkingConfig: {
          thinkingBudget: 0,
        },
        systemInstruction: systemPrompt,
        responseSchema: responseStructure,
        responseMimeType: "application/json",
      };

      const contents: any[] = [
        {
          role: "user",
          parts: pdfData
            ? [
                {
                  text: `Generate a quiz about: ${topic}. Use the following document as reference.`,
                },
                {
                  inlineData: {
                    mimeType: pdfData.mimeType,
                    data: pdfData.data,
                  },
                },
              ]
            : [{ text: `Generate a quiz about: ${topic}` }],
        },
      ];

      const response = await ai.models.generateContentStream({
        model: "gemini-2.0-flash-exp",
        config,
        contents,
      });

      let fullText = "";
      for await (const chunk of response) {
        const chunkText = chunk.text ?? "";
        fullText += chunkText;
        onChunk(chunkText);
      }

      const quizData = JSON.parse(fullText);
      return {
        title: `${topic} Quiz`,
        topic,
        cards: quizData.cards,
      };
    } catch (err) {
      error.value =
        err instanceof Error ? err.message : "Failed to generate quiz";
      console.error("Quiz generation error:", err);
      return null;
    } finally {
      isGenerating.value = false;
    }
  }

  return {
    isGenerating,
    error,
    generateQuiz,
    generateQuizStream,
  };
}
