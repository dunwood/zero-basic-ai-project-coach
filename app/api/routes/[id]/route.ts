import { NextResponse } from "next/server";
import { getRouteById } from "@/lib/server/routes";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const { id } = await context.params;
    const route = await getRouteById(id);

    if (!route) {
      return NextResponse.json({ message: "未找到对应路线" }, { status: 404 });
    }

    return NextResponse.json(route);
  } catch (error) {
    console.error("GET /api/routes/[id] failed:", error);
    return NextResponse.json({ message: "路线详情读取失败" }, { status: 500 });
  }
}
