export type CreateProjectInput = {
  title: string;
  idea: string;
};

export type ProjectStatus = "draft" | "clarifying";

export type ProjectRecord = {
  id: string;
  title: string;
  idea: string;
  status: ProjectStatus;
  createdAt: string;
};

export type UpdateProjectStatusInput = {
  status: ProjectStatus;
};
