import { clarifyQuestionKeys } from "@/lib/constants/clarify-questions";
import {
  createLocalProject,
  ensureLocalProjectTasks,
  getLocalProjectById,
  getLocalProjectTasks,
  listLocalRecentProjects,
  saveLocalProjectClarification,
  updateLocalProjectDetails,
  updateLocalProjectStatus,
  updateLocalProjectTask,
} from "@/lib/server/local-project-store";
import type {
  ClarificationAnswers,
  CreateProjectInput,
  ProjectStatus,
  RecentProjectSummary,
  SaveProjectClarificationInput,
  UpdateProjectDetailsInput,
  UpdateProjectStatusInput,
  UpdateProjectTaskInput,
} from "@/lib/types/project";

const TITLE_MAX_LENGTH = 80;
const IDEA_MAX_LENGTH = 2000;

export function validateProjectInput(input: CreateProjectInput) {
  const title = input.title.trim();
  const idea = input.idea.trim();

  if (!title) {
    return { error: "项目名称不能为空。" };
  }

  if (!idea) {
    return { error: "项目想法不能为空。" };
  }

  if (title.length > TITLE_MAX_LENGTH) {
    return { error: `项目名称请控制在 ${TITLE_MAX_LENGTH} 个字符以内。` };
  }

  if (idea.length > IDEA_MAX_LENGTH) {
    return { error: `项目想法请控制在 ${IDEA_MAX_LENGTH} 个字符以内。` };
  }

  return { title, idea };
}

export function validateProjectDetailsInput(input: Partial<UpdateProjectDetailsInput>) {
  return validateProjectInput({
    title: input.title ?? "",
    idea: input.idea ?? "",
  });
}

export async function createProject(input: CreateProjectInput) {
  return createLocalProject(input);
}

export async function getProjectById(id: string) {
  return getLocalProjectById(id);
}

export async function listRecentProjects(limit = 6): Promise<RecentProjectSummary[]> {
  return listLocalRecentProjects(limit);
}

export function validateProjectStatusInput(input: Partial<UpdateProjectStatusInput>) {
  if (input.status !== "clarifying") {
    return { error: "无效状态。" };
  }

  return { status: "clarifying" as const };
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  return updateLocalProjectStatus(id, status);
}

export async function updateProjectDetails(id: string, input: UpdateProjectDetailsInput) {
  return updateLocalProjectDetails(id, input);
}

export function validateClarificationAnswersInput(input: Partial<SaveProjectClarificationInput>) {
  if (!input.answers || typeof input.answers !== "object" || Array.isArray(input.answers)) {
    return { error: "请先完成所有澄清回答。" };
  }

  const answers: ClarificationAnswers = {};

  for (const key of clarifyQuestionKeys) {
    const value = input.answers[key];

    if (typeof value !== "string" || !value.trim()) {
      return { error: "请先完成所有澄清回答。" };
    }

    answers[key] = value.trim();
  }

  return { answers };
}

export async function saveProjectClarification(id: string, answers: ClarificationAnswers) {
  return saveLocalProjectClarification(id, answers);
}

export async function ensureProjectTasks(id: string) {
  return ensureLocalProjectTasks(id);
}

export async function getProjectTasks(id: string) {
  return getLocalProjectTasks(id);
}

export function validateProjectTaskInput(input: Partial<UpdateProjectTaskInput>) {
  if (typeof input.isDone !== "boolean") {
    return { error: "任务状态无效。" };
  }

  return { isDone: input.isDone };
}

export async function updateProjectTask(projectId: string, taskId: string, isDone: boolean) {
  return updateLocalProjectTask(projectId, taskId, isDone);
}
