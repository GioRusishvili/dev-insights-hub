import { NextResponse } from "next/server";
import { fetchGitHubStats } from "@/lib/github";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get("username") || "octocat";

  try {
    const data = await fetchGitHubStats(username);
    return NextResponse.json({ success: true, data });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
