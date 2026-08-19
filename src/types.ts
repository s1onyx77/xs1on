export type GradeLevel = 'elementary' | 'middle_school' | 'high_school' | 'college_basics';

export type ExplanationStyle = 'standard' | 'simple_kid' | 'deep_conceptual' | 'visual_focus';

export interface MathStep {
  stepNumber: number;
  title: string;
  mathExpression: string; // LaTeX formatted string
  operation: string; // e.g. "Subtract 7 from both sides"
  explanation: string; // Clear, step-by-step why and how
  tipOrPitfall?: string; // Helpful tip or mistake to avoid
  ruleApplied?: string; // e.g. "Subtraction Property of Equality"
  highlightPart?: string; // What changed in this step
}

export interface VisualModelData {
  type: 'balance_scale' | 'fraction_bars' | 'number_line' | 'geometric_shape' | 'step_flow' | 'none';
  title: string;
  description: string;
  data: {
    // For balance scale
    leftSide?: string;
    rightSide?: string;
    balanced?: boolean;
    // For fraction bars
    fractions?: Array<{ numerator: number; denominator: number; label?: string; color?: string }>;
    // For number line
    min?: number;
    max?: number;
    points?: Array<{ value: number; label: string; color?: string }>;
    intervals?: Array<{ start: number; end: number; label: string; color?: string }>;
    // For geometric shapes
    shape?: 'triangle' | 'rectangle' | 'circle' | 'trapezoid';
    dimensions?: Record<string, number | string>;
    formula?: string;
  };
}

export interface PracticeProblem {
  id: string;
  question: string;
  mathExpression?: string;
  options?: string[]; // Multiple choice options if applicable
  correctAnswer: string;
  hint: string;
  explanation: string;
  solutionSteps: Array<{ mathExpression: string; explanation: string }>;
}

export interface MathSolution {
  id: string;
  timestamp: number;
  originalInput: string;
  cleanedProblem: string;
  topic: string; // e.g., "Linear Equations", "Fraction Addition", "Percentages", "Order of Operations"
  subTopic?: string;
  gradeLevel: GradeLevel;
  difficulty: 'Basic' | 'Intermediate' | 'Advanced';
  finalAnswer: string;
  finalAnswerLatex: string;
  keyFormulaOrRule?: string;
  steps: MathStep[];
  visualModel?: VisualModelData;
  realWorldAnalogy: string;
  conceptSummary: string;
  commonMistakes: string[];
  similarPracticeProblems: PracticeProblem[];
}

export interface TutorChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: number;
  stepContext?: number;
}

export interface PracticeSet {
  topic: string;
  title: string;
  description: string;
  problems: PracticeProblem[];
}
