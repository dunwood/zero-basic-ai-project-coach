import { prisma } from "@/lib/prisma";
import type { CreateProjectInput, ProjectRecord } from "@/lib/types/project";

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

export function toProjectRecord(project: {
  id: string;
  title: string;
  idea: string;
  status: string;
  createdAt: Date;
}): ProjectRecord {
  return {
    id: project.id,
    title: project.title,
    idea: project.idea,
    status: project.status,
    createdAt: project.createdAt.toISOString(),
  };
}

export async function createProject(input: CreateProjectInput) {
  const project = await prisma.project.create({
    data: {
      title: input.title,
      idea: input.idea,
    },
    select: {
      id: true,
      title: true,
      idea: true,
      status: true,
      createdAt: true,
    },
  });

  return toProjectRecord(project);
}

export async function getProjectById(id: string) {
  return prisma.project.findUnique({
    where: { id },
    select: {
      id: true,
      title: true,
      idea: true,
      status: true,
      createdAt: true,
    },
  });
}
