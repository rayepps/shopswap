export type QuestionType = "single-select" | "multi-select" | "binary";

export interface Company {
  id: string;
  name: string;
  matches: number;
  matchedAt: number
  profile: {
    timestamp: number
    responses: {
      question: Question
      answers: Answer[]
    }[]
  }
}

export interface Match {
  company: Company
  score: number
}

export interface ProfileResponse {
  questionKey: string;
  answers: Answer[];
}

export interface Answer {
  option: string | null;
  value: string | null;
}

export interface Question {
  key: string;
  label: string;
  comment: string | null;
  type: QuestionType;
  weight: number;
  otherable: boolean;
  catchall: string | null;
  limit: number | null;
  options?: {
    label: string;
    key: string;
  }[];
}
