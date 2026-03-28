import { NextResponse } from "next/server";
import {
  saveProjectClarification,
  validateClarificationAnswersInput,
} from "@/lib/server/projects";
import type { SaveProjectClarificationInput } from "@/lib/types/project";

type ClarifyRouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(request: Request, context: ClarifyRouteContext) {
  try {
    const { id } = await context.params;
    const body = (await request.json()) as Partial<SaveProjectClarificationInput>;
    const validated = validateClarificationAnswersInput(body);

    if ("error" in validated) {
      return NextResponse.json({ success: false, error: validated.error }, { status: 400 });
    }

    const result = await saveProjectClarification(id, validated.answers);

    if (!result) {
      return NextResponse.json({ success: false, error: "项目不存在。" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      project: {
        id: result.project.id,
        status: result.project.status,
      },
      clarification: {
        projectId: result.clarification.projectId,
        answers: result.clarification.answers,
      },
    });
  } catch (error) {
    console.error("POST /api/projects/[id]/clarify failed:", error);
    return NextResponse.json(
      { success: false, error: "澄清回答保存失败，请稍后再试。" },
      { status: 500 },
    );
  }
}
