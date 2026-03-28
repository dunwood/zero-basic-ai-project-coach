export type CreateProjectInput = {
  title: string;
  idea: string;
};

export type ProjectStatus = "draft" | "clarifying" | "clarified";

export type ClarificationAnswers = Record<string, string>;

export type ProjectClarificationRecord = {
  projectId: string;
  answers: ClarificationAnswers;
  createdAt: string;
  updatedAt: string;
};

export type ProjectRecord = {
  id: string;
  title: string;
  idea: string;
  status: ProjectStatus;
  createdAt: string;
  clarification: ProjectClarificationRecord | null;
};

export type UpdateProjectStatusInput = {
  status: ProjectStatus;
};

export type SaveProjectClarificationInput = {
  answers: ClarificationAnswers;
};
