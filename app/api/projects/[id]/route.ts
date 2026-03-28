import { NextResponse } from "next/server";
import {
  getProjectById,
  updateProjectStatus,
  validateProjectStatusInput,
} from "@/lib/server/projects";
import type { UpdateProjectStatusInput } from "@/lib/types/project";

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
    const body = (await request.json()) as Partial<UpdateProjectStatusInput>;
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
  } catch (error) {
    console.error("PATCH /api/projects/[id] failed:", error);
    return NextResponse.json(
      { success: false, error: "项目状态更新失败，请稍后再试。" },
      { status: 500 },
    );
  }
}
