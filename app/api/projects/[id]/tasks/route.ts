import { NextResponse } from "next/server";
import { getProjectById, getProjectTasks } from "@/lib/server/projects";

type ProjectTasksRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: ProjectTasksRouteContext) {
  try {
    const { id } = await context.params;
    const project = await getProjectById(id);

    if (!project) {
      return NextResponse.json({ success: false, error: "项目不存在。" }, { status: 404 });
    }

    if (project.status !== "clarified" || !project.clarification) {
      return NextResponse.json(
        { success: false, error: "请先完成需求澄清，再查看任务清单。" },
        { status: 400 },
      );
    }

    const tasks = await getProjectTasks(id);

    return NextResponse.json({ success: true, tasks: tasks ?? [] });
  } catch (error) {
    console.error("GET /api/projects/[id]/tasks failed:", error);
    return NextResponse.json(
      { success: false, error: "任务清单读取失败，请稍后再试。" },
      { status: 500 },
    );
  }
}
