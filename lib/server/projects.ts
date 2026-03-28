import { prisma } from "@/lib/prisma";
import { clarifyQuestionKeys } from "@/lib/constants/clarify-questions";
import { flattenTaskPlan } from "@/lib/server/task-plan";
import type {
  ClarificationAnswers,
  CreateProjectInput,
  ProjectClarificationRecord,
  ProjectRecord,
  ProjectStatus,
  ProjectTaskRecord,
  RecentProjectSummary,
  SaveProjectClarificationInput,
  UpdateProjectStatusInput,
  UpdateProjectTaskInput,
} from "@/lib/types/project";

const TITLE_MAX_LENGTH = 80;
const IDEA_MAX_LENGTH = 2000;

const projectSelect = {
  id: true,
  title: true,
  idea: true,
  status: true,
  createdAt: true,
  updatedAt: true,
  clarification: {
    select: {
      projectId: true,
      answers: true,
      createdAt: true,
      updatedAt: true,
    },
  },
  tasks: {
    select: {
      id: true,
      projectId: true,
      phaseKey: true,
      phaseTitle: true,
      title: true,
      description: true,
      sortOrder: true,
      isDone: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: {
      sortOrder: "asc" as const,
    },
  },
} satisfies Parameters<typeof prisma.project.findUnique>[0]["select"];

type ProjectPayload = {
  id: string;
  title: string;
  idea: string;
  status: ProjectStatus;
  createdAt: Date;
  updatedAt: Date;
  clarification?: {
    projectId: string;
    answers: unknown;
    createdAt: Date;
    updatedAt: Date;
  } | null;
  tasks: Array<{
    id: string;
    projectId: string;
    phaseKey: string;
    phaseTitle: string;
    title: string;
    description: string | null;
    sortOrder: number;
    isDone: boolean;
    createdAt: Date;
    updatedAt: Date;
  }>;
};

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

export function toProjectRecord(project: ProjectPayload): ProjectRecord {
  return {
    id: project.id,
    title: project.title,
    idea: project.idea,
    status: project.status,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    clarification: project.clarification ? toProjectClarificationRecord(project.clarification) : null,
    tasks: project.tasks.map(toProjectTaskRecord),
  };
}

export function toProjectClarificationRecord(clarification: {
  projectId: string;
  answers: unknown;
  createdAt: Date;
  updatedAt: Date;
}): ProjectClarificationRecord {
  return {
    projectId: clarification.projectId,
    answers: clarification.answers as ClarificationAnswers,
    createdAt: clarification.createdAt.toISOString(),
    updatedAt: clarification.updatedAt.toISOString(),
  };
}

export function toProjectTaskRecord(task: {
  id: string;
  projectId: string;
  phaseKey: string;
  phaseTitle: string;
  title: string;
  description: string | null;
  sortOrder: number;
  isDone: boolean;
  createdAt: Date;
  updatedAt: Date;
}): ProjectTaskRecord {
  return {
    id: task.id,
    projectId: task.projectId,
    phaseKey: task.phaseKey,
    phaseTitle: task.phaseTitle,
    title: task.title,
    description: task.description,
    sortOrder: task.sortOrder,
    isDone: task.isDone,
    createdAt: task.createdAt.toISOString(),
    updatedAt: task.updatedAt.toISOString(),
  };
}

export async function createProject(input: CreateProjectInput) {
  const project = await prisma.project.create({
    data: {
      title: input.title,
      idea: input.idea,
    },
    select: projectSelect,
  });

  return toProjectRecord(project as ProjectPayload);
}

export async function getProjectById(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    select: projectSelect,
  });

  if (!project) {
    return null;
  }

  return toProjectRecord(project as ProjectPayload);
}

export async function listRecentProjects(limit = 6): Promise<RecentProjectSummary[]> {
  const projects = await prisma.project.findMany({
    orderBy: {
      updatedAt: "desc",
    },
    take: limit,
    select: {
      id: true,
      title: true,
      status: true,
      createdAt: true,
      updatedAt: true,
      tasks: {
        select: {
          id: true,
          isDone: true,
        },
      },
    },
  });

  return projects.map((project) => ({
    id: project.id,
    title: project.title,
    status: project.status as ProjectStatus,
    createdAt: project.createdAt.toISOString(),
    updatedAt: project.updatedAt.toISOString(),
    taskSummary: {
      total: project.tasks.length,
      done: project.tasks.filter((task) => task.isDone).length,
    },
  }));
}

export function validateProjectStatusInput(input: Partial<UpdateProjectStatusInput>) {
  if (input.status !== "clarifying") {
    return { error: "无效状态。" };
  }

  return { status: "clarifying" as const };
}

export async function updateProjectStatus(id: string, status: ProjectStatus) {
  const existingProject = await prisma.project.findUnique({
    where: { id },
    select: projectSelect,
  });

  if (!existingProject) {
    return null;
  }

  if (existingProject.status === status) {
    return toProjectRecord(existingProject as ProjectPayload);
  }

  const project = await prisma.project.update({
    where: { id },
    data: { status },
    select: projectSelect,
  });

  return toProjectRecord(project as ProjectPayload);
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
  const existingProject = await prisma.project.findUnique({
    where: { id },
    select: { id: true },
  });

  if (!existingProject) {
    return null;
  }

  const clarification = await prisma.projectClarification.upsert({
    where: { projectId: id },
    update: { answers },
    create: {
      projectId: id,
      answers,
    },
    select: {
      projectId: true,
      answers: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  const project = await prisma.project.update({
    where: { id },
    data: { status: "clarified" },
    select: projectSelect,
  });

  return {
    project: toProjectRecord(project as ProjectPayload),
    clarification: toProjectClarificationRecord(clarification),
  };
}

export async function ensureProjectTasks(id: string) {
  const project = await prisma.project.findUnique({
    where: { id },
    select: projectSelect,
  });

  if (!project) {
    return null;
  }

  const projectRecord = toProjectRecord(project as ProjectPayload);

  if (projectRecord.status !== "clarified" || !projectRecord.clarification) {
    return projectRecord;
  }

  if (projectRecord.tasks.length > 0) {
    return projectRecord;
  }

  const taskSeeds = flattenTaskPlan(projectRecord);

  if (taskSeeds.length === 0) {
    return projectRecord;
  }

  await prisma.projectTask.createMany({
    data: taskSeeds.map((task) => ({
      projectId: id,
      phaseKey: task.phaseKey,
      phaseTitle: task.phaseTitle,
      title: task.title,
      description: task.description,
      sortOrder: task.sortOrder,
    })),
  });

  const refreshedProject = await prisma.project.findUnique({
    where: { id },
    select: projectSelect,
  });

  if (!refreshedProject) {
    return null;
  }

  return toProjectRecord(refreshedProject as ProjectPayload);
}

export async function getProjectTasks(id: string) {
  const project = await ensureProjectTasks(id);

  if (!project) {
    return null;
  }

  return project.tasks;
}

export function validateProjectTaskInput(input: Partial<UpdateProjectTaskInput>) {
  if (typeof input.isDone !== "boolean") {
    return { error: "任务状态无效。" };
  }

  return { isDone: input.isDone };
}

export async function updateProjectTask(projectId: string, taskId: string, isDone: boolean) {
  const existingTask = await prisma.projectTask.findFirst({
    where: {
      id: taskId,
      projectId,
    },
    select: {
      id: true,
      projectId: true,
      phaseKey: true,
      phaseTitle: true,
      title: true,
      description: true,
      sortOrder: true,
      isDone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  if (!existingTask) {
    return null;
  }

  const task = await prisma.projectTask.update({
    where: { id: taskId },
    data: { isDone },
    select: {
      id: true,
      projectId: true,
      phaseKey: true,
      phaseTitle: true,
      title: true,
      description: true,
      sortOrder: true,
      isDone: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return toProjectTaskRecord(task);
}
