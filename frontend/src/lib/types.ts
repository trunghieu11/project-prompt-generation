export interface Option {
  text: string;
}

export interface Question {
  text: string;
  options: string[];
}

export interface ExplainResponse {
  question_explanation: string;
  option_explanations: Record<string, string>;
}

export interface Answer {
  question: string;
  selected_option: string;
}

export interface ProjectState {
  id?: string;
  idea: string;
  totalQuestions: number;
  history: Answer[];
  currentQuestion: Question | null;
  loading: boolean;
  error: string | null;
  finalPrompt: string | null;
  selectedPhases: ProjectPhase[];
}

export type ProjectPhase =
  | 'Core Features'
  | 'Tech Stack'
  | 'UI/UX Design'
  | 'Data Strategy'
  | 'Security & Privacy'
  | 'Testing Strategy'
  | 'DevOps & Scalability'
  | 'Observability & Maintenance';
