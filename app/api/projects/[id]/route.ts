import { NextResponse } from "next/server";
import {
  getProjectById,
  updateProjectDetails,
  updateProjectStatus,
  validateProjectDetailsInput,
  validateProjectStatusInput,
} from "@/lib/server/projects";
import type { UpdateProjectDetailsInput, UpdateProjectStatusInput } from "@/lib/types/project";

type ProjectRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: ProjectRouteContext) {
  try {
    const { id } = await context.params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ success: false, error: "项目不存在。" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("GET /api/projects/[id] failed:", error);
    return NextResponse.json(
      { success: false, error: "项目读取失败，请稍后再试。" },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request, context: ProjectRouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<UpdateProjectStatusInput & UpdateProjectDetailsInput>;

    if ("status" in body && typeof body.status !== "undefined" && !("title" in body) && !("idea" in body)) {
      const validated = validateProjectStatusInput(body);

      if ("error" in validated) {
        return NextResponse.json({ success: false, error: validated.error }, { status: 400 });
      }

      const project = await updateProjectStatus(id, validated.status);

      if (!project) {
        return NextResponse.json({ success: false, error: "项目不存在。" }, { status: 404 });
      }

      return NextResponse.json({
        success: true,
        project: {
          id: project.id,
          status: project.status,
        },
      });
    }

    const validated = validateProjectDetailsInput(body);

    if ("error" in validated) {
      return NextResponse.json({ success: false, error: validated.error }, { status: 400 });
    }

    const project = await updateProjectDetails(id, validated);

    if (!project) {
      return NextResponse.json({ success: false, error: "项目不存在。" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      project: {
        id: project.id,
        title: project.title,
        idea: project.idea,
        status: project.status,
        updatedAt: project.updatedAt,
      },
    });
  } catch (error) {
    console.error("PATCH /api/projects/[id] failed:", error);
    return NextResponse.json(
      { success: false, error: "项目更新失败，请稍后再试。" },
      { status: 500 },
    );
  }
}
