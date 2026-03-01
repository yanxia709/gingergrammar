export enum Difficulty {
  Beginner = "Beginner",
  Intermediate = "Intermediate",
  Advanced = "Advanced",
}

export enum GrammarPoint {
  NonFiniteVerbs = "Non-finite Verbs",
  RelativeClauses = "Relative Clauses",
  AdverbialClauses = "Adverbial Clauses",
  NounClauses = "Noun Clauses",
  Conjunctions = "Conjunctions",
  Conditionals = "Conditionals",
}

export interface Explanation {
  correctAnswer: string;
  rule: string;
  example: string;
  commonMistake: string;
}

export interface Question {
  id: string;
  sentence: string; // Use "____" as placeholder
  options: string[];
  correctIndex: number;
  difficulty: Difficulty;
  category: GrammarPoint;
  explanation: Explanation;
}

export interface UserAnswer {
  questionId: string;
  selectedIndex: number;
  isCorrect: boolean;
}
