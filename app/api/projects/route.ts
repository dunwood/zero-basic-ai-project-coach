import { NextResponse } from "next/server";
import { createProject, validateProjectInput } from "@/lib/server/projects";
import type { CreateProjectInput } from "@/lib/types/project";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<CreateProjectInput>;
    const validated = validateProjectInput({
      title: body.title ?? "",
      idea: body.idea ?? "",
    });

    if ("error" in validated) {
      return NextResponse.json({ success: false, error: validated.error }, { status: 400 });
    }

    const project = await createProject(validated);

    return NextResponse.json({
      success: true,
      project,
    });
  } catch (error) {
    console.error("POST /api/projects failed:", error);
    return NextResponse.json(
      { success: false, error: "项目创建失败，请稍后再试。" },
      { status: 500 },
    );
  }
}
