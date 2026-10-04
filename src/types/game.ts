export type AsykPosition = 'alshy' | 'tayke' | 'buk' | 'shik';

export interface AnswerOption {
  id: string;
  text: string;
  isCorrect: boolean;
  asykType: AsykPosition;
  label: 'A' | 'B' | 'C' | 'D';
}

export interface Question {
  id: number;
  question: string;
  quote?: string;
  options: AnswerOption[];
  explanation: string;
  historicalContext: string;
  literaryDetail: string;
}

export type GameMode = 'STORY' | 'ARCADE';

export interface RoundResult {
  questionId: number;
  selectedOptionId: string;
  isCorrect: boolean;
  accuracyScore: number;
  timeSpentSeconds: number;
}

export interface GameSummary {
  totalQuestions: number;
  correctAnswers: number;
  asyksKnockedOut: number;
  totalScore: number;
  accuracyPercentage: number;
  streak: number;
  longestStreak: number;
  titleRank: string;
  rankDescription: string;
  roundResults: RoundResult[];
}
