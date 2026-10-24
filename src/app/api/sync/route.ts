import { NextResponse } from "next/server";
import { normalizeDeveloperMetrics } from "@/lib/normalizer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const leetcode = searchParams.get("leetcode");
  const github = searchParams.get("github");

  if (!leetcode || !github) {
    return NextResponse.json(
      { success: false, error: "Both 'leetcode' and 'github' query parameters are required." },
      { status: 400 }
    );
  }

  try {
    const metrics = await normalizeDeveloperMetrics(leetcode, github);
    return NextResponse.json({ success: true, data: metrics });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
