export type MaterialKey = 'sponge' | 'felt' | 'cardboard';

export interface MaterialInfo {
  id: MaterialKey;
  name: string;
  description: string;
  badgeColor: string;
  barColor: string;
}

export interface ExperimentMeasurements {
  baseline: number | null;
  sponge: number | null;
  felt: number | null;
  cardboard: number | null;
}

export interface ReductionRates {
  sponge: number | null;
  felt: number | null;
  cardboard: number | null;
}

export interface ExperimentState {
  studentName: string;
  hypothesis: string;
  measurements: ExperimentMeasurements;
  inputMode: 'manual' | 'ezmaker';
}

export interface AiCoachingFeedback {
  observedFeatures: string;
  hypothesisComparison: string;
  controlledVariablesAndErrors: string;
  nextVariablesToChange: string;
  nextInquiryQuestions: string;
  perspectiveNote?: string;
}

export interface AiAnalysisRequestPayload {
  studentName?: string;
  hypothesis: string;
  baseline: number;
  measurements: {
    material: string;
    value: number;
    reductionRate: number;
  }[];
}

export interface AiAnalysisResponsePayload {
  success: boolean;
  feedback?: AiCoachingFeedback;
  error?: string;
}
