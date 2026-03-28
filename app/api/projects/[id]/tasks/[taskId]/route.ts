import { NextResponse } from "next/server";
import { updateProjectTask, validateProjectTaskInput } from "@/lib/server/projects";
import type { UpdateProjectTaskInput } from "@/lib/types/project";

type ProjectTaskRouteContext = {
  params: Promise<{
    id: string;
    taskId: string;
  }>;
};

export async function PATCH(request: Request, context: ProjectTaskRouteContext) {
  try {
    const { id, taskId } = await context.params;
    const body = (await request.json()) as Partial<UpdateProjectTaskInput>;
    const validated = validateProjectTaskInput(body);

    if ("error" in validated) {
      return NextResponse.json({ success: false, error: validated.error }, { status: 400 });
    }

    const task = await updateProjectTask(id, taskId, validated.isDone);

    if (!task) {
      return NextResponse.json({ success: false, error: "任务不存在。" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      task: {
        id: task.id,
        isDone: task.isDone,
      },
    });
  } catch (error) {
    console.error("PATCH /api/projects/[id]/tasks/[taskId] failed:", error);
    return NextResponse.json(
      { success: false, error: "任务状态更新失败，请稍后再试。" },
      { status: 500 },
    );
  }
}
