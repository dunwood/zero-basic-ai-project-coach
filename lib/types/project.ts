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

export type ProjectTaskRecord = {
  id: string;
  projectId: string;
  phaseKey: string;
  phaseTitle: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isDone: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ProjectRecord = {
  id: string;
  title: string;
  idea: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  clarification: ProjectClarificationRecord | null;
  tasks: ProjectTaskRecord[];
};

export type RecentProjectSummary = {
  id: string;
  title: string;
  status: ProjectStatus;
  createdAt: string;
  updatedAt: string;
  taskSummary: {
    total: number;
    done: number;
  };
};

export type UpdateProjectStatusInput = {
  status: ProjectStatus;
};

export type SaveProjectClarificationInput = {
  answers: ClarificationAnswers;
};

export type UpdateProjectTaskInput = {
  isDone: boolean;
};
