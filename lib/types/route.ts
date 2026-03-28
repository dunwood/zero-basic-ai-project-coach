export type RouteStepData = {
  id: string;
  stepOrder: number;
  title: string;
  content: string;
  successHint: string | null;
  troubleshootingHint: string | null;
};

export type RouteCardData = {
  id: string;
  name: string;
  summary: string;
  fitFor: string;
  requirement: string;
  difficulty: string;
  tag: string;
};

export type RouteDetailData = RouteCardData & {
  modelName: string;
  toolName: string;
  sortOrder: number;
  isActive: boolean;
  steps: RouteStepData[];
};
