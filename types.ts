
export interface GoogleUser {
  name: string;
  email: string;
  picture: string;
}

export interface StudyNote {
  id: string;
  content: string;
  createdAt: number;
  reviewDates: number[];
  lastReviewed: number | null;
}

export enum QuestionType {
  SHORT_ANSWER = 'SHORT_ANSWER',
  TRUE_FALSE = 'TRUE_FALSE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
}

export interface QuizQuestion {
  question: string;
  type: QuestionType;
  options?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  correctAnswer: string;
}

export interface QuizFeedbackItem {
  question: string;
  userAnswer: string;
  correctAnswer: string;
  feedback: string;
  isCorrect: boolean;
}