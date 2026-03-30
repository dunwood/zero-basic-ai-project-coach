"use client";

import { flattenTaskPlan } from "@/lib/server/task-plan";
import type {
  ClarificationAnswers,
  CreateProjectInput,
  ProjectRecord,
  ProjectTaskRecord,
  ProjectStatus,
  RecentProjectSummary,
  UpdateProjectDetailsInput,
} from "@/lib/types/project";

const PROJECT_STORE_KEY = "zero-basic-ai-project-coach.projects";

type BrowserProjectStore = {
  projects: ProjectRecord[];
};

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function getStorage() {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage;
}

function readStore(): BrowserProjectStore {
  const storage = getStorage();

  if (!storage) {
    return { projects: [] };
  }

  const raw = storage.getItem(PROJECT_STORE_KEY);

  if (!raw) {
    return { projects: [] };
  }

  try {
    const parsed = JSON.parse(raw) as BrowserProjectStore;
    return {
      projects: Array.isArray(parsed.projects) ? parsed.projects : [],
    };
  } catch (error) {
    console.error("Browser project store parse failed:", error);
    storage.removeItem(PROJECT_STORE_KEY);
    return { projects: [] };
  }
}

function writeStore(store: BrowserProjectStore) {
  const storage = getStorage();

  if (!storage) {
    return;
  }

  storage.setItem(PROJECT_STORE_KEY, JSON.stringify(store));
}

function sortRecent(projects: ProjectRecord[]) {
  return [...projects].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

function buildTaskSummary(project: ProjectRecord) {
  return {
    total: project.tasks.length,
    done: project.tasks.filter((task) => task.isDone).length,
  };
}

function buildLocalTasks(project: ProjectRecord): ProjectTaskRecord[] {
  const timestamp = nowIso();

  return flattenTaskPlan(project).map((task) => ({
    id: createId("task"),
    projectId: project.id,
    phaseKey: task.phaseKey,
    phaseTitle: task.phaseTitle,
    title: task.title,
    description: task.description,
    sortOrder: task.sortOrder,
    isDone: false,
    createdAt: timestamp,
    updatedAt: timestamp,
  }));
}

export function listBrowserRecentProjects(limit = 6): RecentProjectSummary[] {
  const store = readStore();

  return sortRecent(store.projects)
    .slice(0, limit)
    .map((project) => ({
      id: project.id,
      title: project.title,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      taskSummary: buildTaskSummary(project),
    }));
}

export function createBrowserProject(input: CreateProjectInput): ProjectRecord {
  const store = readStore();
  const timestamp = nowIso();
  const project: ProjectRecord = {
    id: createId("project"),
    title: input.title,
    idea: input.idea,
    status: "draft",
    createdAt: timestamp,
    updatedAt: timestamp,
    clarification: null,
    tasks: [],
  };

  store.projects.push(project);
  writeStore(store);
  return project;
}

export function getBrowserProjectById(id: string): ProjectRecord | null {
  const store = readStore();
  return store.projects.find((project) => project.id === id) ?? null;
}

export function updateBrowserProjectStatus(id: string, status: ProjectStatus): ProjectRecord | null {
  const store = readStore();
  const project = store.projects.find((item) => item.id === id);

  if (!project) {
    return null;
  }

  project.status = status;
  project.updatedAt = nowIso();
  writeStore(store);
  return project;
}

export function updateBrowserProjectDetails(
  id: string,
  input: UpdateProjectDetailsInput,
): ProjectRecord | null {
  const store = readStore();
  const project = store.projects.find((item) => item.id === id);

  if (!project) {
    return null;
  }

  project.title = input.title.trim();
  project.idea = input.idea.trim();
  project.updatedAt = nowIso();
  writeStore(store);
  return project;
}

export function saveBrowserProjectClarification(
  id: string,
  answers: ClarificationAnswers,
): ProjectRecord | null {
  const store = readStore();
  const project = store.projects.find((item) => item.id === id);

  if (!project) {
    return null;
  }

  const timestamp = nowIso();
  project.clarification = {
    projectId: id,
    answers,
    createdAt: project.clarification?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };
  project.status = "clarified";
  project.updatedAt = timestamp;
  writeStore(store);
  return project;
}

export function ensureBrowserProjectTasks(id: string): ProjectRecord | null {
  const store = readStore();
  const project = store.projects.find((item) => item.id === id);

  if (!project) {
    return null;
  }

  if (project.status !== "clarified" || !project.clarification || project.tasks.length > 0) {
    return project;
  }

  project.tasks = buildLocalTasks(project);
  project.updatedAt = nowIso();
  writeStore(store);
  return project;
}

export function updateBrowserProjectTask(
  projectId: string,
  taskId: string,
  isDone: boolean,
): ProjectTaskRecord | null {
  const store = readStore();
  const project = store.projects.find((item) => item.id === projectId);

  if (!project) {
    return null;
  }

  const task = project.tasks.find((item) => item.id === taskId);

  if (!task) {
    return null;
  }

  task.isDone = isDone;
  task.updatedAt = nowIso();
  project.updatedAt = nowIso();
  writeStore(store);
  return task;
}
