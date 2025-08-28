import { GoogleGenAI, Type } from "@google/genai";
import type { QuizQuestion, QuizFeedbackItem, StudyNote } from '../types';
import { QuestionType } from '../types';

// The API key must be obtained from environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not set in environment variables.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const quizGenerationSchema = {
  type: Type.OBJECT,
  properties: {
    quiz: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          question: {
            type: Type.STRING,
            description: "The question text.",
          },
          type: {
            type: Type.STRING,
            enum: [QuestionType.SHORT_ANSWER, QuestionType.TRUE_FALSE, QuestionType.MULTIPLE_CHOICE],
            description: "The type of question.",
          },
          options: {
            type: Type.ARRAY,
            description: "A list of options for multiple choice questions. Should be null for other types.",
            items: {
                type: Type.STRING,
            }
          },
          difficulty: {
            type: Type.STRING,
            enum: ['easy', 'medium', 'hard'],
            description: "The difficulty of the question."
          },
          correctAnswer: {
            type: Type.STRING,
            description: "The correct answer to the question. For TRUE_FALSE, it should be 'True' or 'False'.",
          },
        },
        required: ["question", "type", "difficulty", "correctAnswer"],
      },
    },
  },
  required: ["quiz"],
};

const feedbackGenerationSchema = {
    type: Type.OBJECT,
    properties: {
        feedback: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    question: { type: Type.STRING },
                    userAnswer: { type: Type.STRING },
                    correctAnswer: { type: Type.STRING, description: "The model's correct answer to the question, in Korean." },
                    feedback: { type: Type.STRING, description: "A brief, helpful explanation in Korean about the correct answer and the relevant concept from the note." },
                    isCorrect: { type: Type.BOOLEAN, description: "Whether the user's answer was correct." },
                },
                required: ["question", "userAnswer", "correctAnswer", "feedback", "isCorrect"],
            }
        }
    },
    required: ["feedback"],
};

export const generateQuizFromNote = async (noteContent: string): Promise<QuizQuestion[]> => {
  try {
    const prompt = `You are an expert Korean tutor. Your task is to create a high-quality quiz from the provided study note, even if the note is short or incomplete. Your goal is to help the student truly learn the subject matter.

1.  **Identify Core Concepts:** First, identify the key concepts or keywords from the note.
2.  **Enrich with Knowledge:** Use your own background knowledge to expand on these concepts, filling in any gaps to create a solid foundation for the quiz.
3.  **Create Meaningful Questions:** Generate 3 diverse questions (one 'easy', one 'medium', one 'hard') that test a deep understanding of the enriched concepts. The questions should promote critical thinking, not just rote memorization.
4.  **Provide a Clear Answer:** For each question, provide a clear and concise correct answer.

Include a mix of SHORT_ANSWER and TRUE_FALSE question types. For TRUE_FALSE questions, the student will answer with 'True' or 'False', and the 'correctAnswer' field should reflect that.

The entire output, including questions, options, and answers, must be in **Korean**.

Original Study Note:
---
${noteContent}
---

Please generate the quiz in the specified JSON format.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: quizGenerationSchema,
      },
    });
    
    const jsonString = response.text;
    const parsed = JSON.parse(jsonString);

    if (parsed.quiz && Array.isArray(parsed.quiz)) {
        return parsed.quiz as QuizQuestion[];
    }
    
    throw new Error("Failed to parse quiz from AI response.");

  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("퀴즈를 생성할 수 없습니다. 다시 시도해 주세요.");
  }
};

export const getFeedbackOnAnswers = async (note: StudyNote, questions: QuizQuestion[], answers: string[]): Promise<QuizFeedbackItem[]> => {
    try {
        const userSubmissions = questions.map((q, i) => ({
            question: q.question,
            userAnswer: answers[i] || "No answer provided",
            correctAnswer: q.correctAnswer,
        }));

        const prompt = `You are a helpful and encouraging Korean teacher. Your task is to provide constructive feedback on a student's quiz answers. Your response must be entirely in Korean.

For each question:
1.  **Evaluate the User's Answer:** Compare the student's answer with the provided correct answer.
2.  **Acknowledge Partial Credit:** Even if the user's answer isn't a perfect match, look for understanding of the core concept. Acknowledge what they got right.
3.  **Provide Constructive Feedback:**
    - If correct, praise the student and briefly reinforce the key concept.
    - If partially correct, affirm the correct parts and gently explain what's missing to make it a complete answer.
    - If incorrect, explain the correct answer clearly and why it's correct. Relate it back to the core concept of the question. Be supportive and avoid discouraging language.
4.  **Use Background Knowledge:** Use the original study note as context, but use your own knowledge to provide richer, more helpful explanations. The goal is to help the student learn, not just check for correctness against the note. For the 'correctAnswer' field in your JSON output, please use the 'correctAnswer' provided for each question in the input below.

Original Study Note (for context):
---
${note.content}
---

Quiz Questions, Correct Answers, and Student's Answers:
---
${JSON.stringify(userSubmissions, null, 2)}
---

Generate the feedback in the specified JSON format.`;

        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: feedbackGenerationSchema,
            },
        });

        const jsonString = response.text;
        const parsed = JSON.parse(jsonString);

        if (parsed.feedback && Array.isArray(parsed.feedback)) {
            return parsed.feedback as QuizFeedbackItem[];
        }

        throw new Error("Failed to parse feedback from AI response.");

    } catch (error) {
        console.error("Error getting feedback:", error);
        throw new Error("답변에 대한 피드백을 받을 수 없습니다. 다시 시도해 주세요.");
    }
};