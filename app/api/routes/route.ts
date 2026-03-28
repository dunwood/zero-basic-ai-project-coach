import { NextResponse } from "next/server";
import { getRoutes } from "@/lib/server/routes";

export async function GET() {
  try {
    const routes = await getRoutes();
    return NextResponse.json(routes);
  } catch (error) {
    console.error("GET /api/routes failed:", error);
    return NextResponse.json({ message: "路线数据读取失败" }, { status: 500 });
  }
}
