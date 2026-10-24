import { Octokit } from "octokit";
import { CleanedGitHubStats, LanguageStats } from "@/types/github";

// Initialize Octokit client (uses optional env token for higher rate limits)
const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN || undefined,
});

export async function fetchGitHubStats(username: string): Promise<CleanedGitHubStats> {
  // 1. Fetch user's public repositories
  const { data: repos } = await octokit.rest.repos.listForUser({
    username,
    type: "owner",
    per_page: 100,
    sort: "updated",
  });

  // Aggregate programming language byte counts across public non-fork repos
  const languageBytesMap: Record<string, number> = {};
  let totalBytes = 0;

  for (const repo of repos.slice(0, 15)) {
    if (repo.fork || !repo.language) continue;
    
    try {
      const { data: languages } = await octokit.rest.repos.listLanguages({
        owner: username,
        repo: repo.name,
      });

      for (const [lang, bytes] of Object.entries(languages)) {
        languageBytesMap[lang] = (languageBytesMap[lang] || 0) + bytes;
        totalBytes += bytes;
      }
    } catch {
      // Skip repository if language details fail to load
      continue;
    }
  }

  // Format language byte distribution percentages
  const topLanguages: LanguageStats[] = Object.entries(languageBytesMap)
    .map(([language, bytes]) => ({
      language,
      bytes,
      percentage: totalBytes > 0 ? Number(((bytes / totalBytes) * 100).toFixed(1)) : 0,
    }))
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 5);

  // 2. Fetch public user activity events to estimate commit frequency
  let recentCommits90Days = 0;

  try {
    const { data: events } = await octokit.rest.activity.listPublicEventsForUser({
      username,
      per_page: 100,
    });

    for (const event of events) {
      if (event.type === "PushEvent" && event.payload && "commits" in event.payload) {
        recentCommits90Days += (event.payload.commits as Array<unknown>).length;
      }
    }
  } catch {
    recentCommits90Days = 0;
  }

  return {
    username,
    publicReposCount: repos.length,
    topLanguages,
    recentCommits90Days,
  };
}
