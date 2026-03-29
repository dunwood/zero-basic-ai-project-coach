import { promises as fs } from "node:fs";
import path from "node:path";
import { flattenTaskPlan } from "@/lib/server/task-plan";
import type {
  ClarificationAnswers,
  CreateProjectInput,
  ProjectRecord,
  ProjectStatus,
  ProjectTaskRecord,
  RecentProjectSummary,
  UpdateProjectDetailsInput,
} from "@/lib/types/project";

const localStoreFile = path.join(process.cwd(), ".local-project-store.json");

type LocalStore = {
  projects: ProjectRecord[];
};

function nowIso() {
  return new Date().toISOString();
}

function createId(prefix: string) {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function readStore(): Promise<LocalStore> {
  try {
    const content = await fs.readFile(localStoreFile, "utf8");
    const parsed = JSON.parse(content) as LocalStore;
    return {
      projects: parsed.projects ?? [],
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      return { projects: [] };
    }

    throw error;
  }
}

async function writeStore(store: LocalStore) {
  await fs.writeFile(localStoreFile, JSON.stringify(store, null, 2), "utf8");
}

function sortRecent(projects: ProjectRecord[]) {
  return [...projects].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt));
}

export async function createLocalProject(input: CreateProjectInput): Promise<ProjectRecord> {
  const store = await readStore();
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
  await writeStore(store);
  return project;
}

export async function getLocalProjectById(id: string): Promise<ProjectRecord | null> {
  const store = await readStore();
  return store.projects.find((project) => project.id === id) ?? null;
}

export async function listLocalRecentProjects(limit = 6): Promise<RecentProjectSummary[]> {
  const store = await readStore();

  return sortRecent(store.projects)
    .slice(0, limit)
    .map((project) => ({
      id: project.id,
      title: project.title,
      status: project.status,
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
      taskSummary: {
        total: project.tasks.length,
        done: project.tasks.filter((task) => task.isDone).length,
      },
    }));
}

export async function updateLocalProjectStatus(
  id: string,
  status: ProjectStatus,
): Promise<ProjectRecord | null> {
  const store = await readStore();
  const project = store.projects.find((item) => item.id === id);

  if (!project) {
    return null;
  }

  project.status = status;
  project.updatedAt = nowIso();
  await writeStore(store);
  return project;
}

export async function updateLocalProjectDetails(
  id: string,
  input: UpdateProjectDetailsInput,
): Promise<ProjectRecord | null> {
  const store = await readStore();
  const project = store.projects.find((item) => item.id === id);

  if (!project) {
    return null;
  }

  project.title = input.title.trim();
  project.idea = input.idea.trim();
  project.updatedAt = nowIso();
  await writeStore(store);
  return project;
}

export async function saveLocalProjectClarification(
  id: string,
  answers: ClarificationAnswers,
): Promise<{ project: ProjectRecord; clarification: NonNullable<ProjectRecord["clarification"]> } | null> {
  const store = await readStore();
  const project = store.projects.find((item) => item.id === id);

  if (!project) {
    return null;
  }

  const timestamp = nowIso();
  const clarification = {
    projectId: id,
    answers,
    createdAt: project.clarification?.createdAt ?? timestamp,
    updatedAt: timestamp,
  };

  project.clarification = clarification;
  project.status = "clarified";
  project.updatedAt = timestamp;
  await writeStore(store);

  return {
    project,
    clarification,
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

export async function ensureLocalProjectTasks(id: string): Promise<ProjectRecord | null> {
  const store = await readStore();
  const project = store.projects.find((item) => item.id === id);

  if (!project) {
    return null;
  }

  if (project.status !== "clarified" || !project.clarification || project.tasks.length > 0) {
    return project;
  }

  project.tasks = buildLocalTasks(project);
  project.updatedAt = nowIso();
  await writeStore(store);
  return project;
}

export async function getLocalProjectTasks(id: string): Promise<ProjectTaskRecord[] | null> {
  const project = await ensureLocalProjectTasks(id);
  return project?.tasks ?? null;
}

export async function updateLocalProjectTask(
  projectId: string,
  taskId: string,
  isDone: boolean,
): Promise<ProjectTaskRecord | null> {
  const store = await readStore();
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
  await writeStore(store);
  return task;
}
