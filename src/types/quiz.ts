export interface Quiz {
  id?: number;
  title: string;
  topic: string;
  cards: Card[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Card {
  cardId: number;
  question: string;
  answers: Answer[];
}

export interface Answer {
  id: string;
  text: string;
  isCorrect: boolean;
  hint?: string;
  explanation?: string;
}

export interface QuizResult {
  id?: number;
  quizId: number;
  score: number;
  totalQuestions: number;
  answers: UserAnswer[];
  completedAt?: Date;
}

export interface UserAnswer {
  cardId: number;
  selectedAnswerId: string;
  isCorrect: boolean;
}
