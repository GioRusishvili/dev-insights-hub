import { fetchLeetCodeStats } from "./leetcode";
import { fetchGitHubStats } from "./github";
import { UnifiedDeveloperMetrics } from "@/types/metrics";

export async function normalizeDeveloperMetrics(
  leetcodeUsername: string,
  githubUsername: string
): Promise<UnifiedDeveloperMetrics> {
  // Fetch stats concurrently using Promise.all
  const [leetcodeStats, githubStats] = await Promise.all([
    fetchLeetCodeStats(leetcodeUsername),
    fetchGitHubStats(githubUsername),
  ]);

  // Categorize LeetCode topics into Strong and Weak
  // Top 3 solved topics are classified as strong; topics with <= 2 solves are weak
  const strongTopics = leetcodeStats.topicStats
    .slice(0, 3)
    .map((t) => t.topic);

  const weakTopics = leetcodeStats.topicStats
    .filter((t) => t.solved <= 2)
    .slice(0, 5)
    .map((t) => t.topic);

  // Default weak fallback if the user has solved many problems across all topics
  if (weakTopics.length === 0) {
    weakTopics.push("Dynamic Programming", "System Design", "Advanced Graphs");
  }

  // Identify primary language from GitHub
  const primaryLanguage =
    githubStats.topLanguages.length > 0
      ? githubStats.topLanguages[0].language
      : "N/A";

  // Calculate simple relative activity score
  const totalActivityScore =
    leetcodeStats.solvedTotal * 2 + githubStats.recentCommits90Days * 3;

  return {
    user: {
      leetcodeUsername,
      githubUsername,
    },
    leetcode: {
      ...leetcodeStats,
      strongTopics,
      weakTopics,
    },
    github: githubStats,
    summary: {
      totalActivityScore,
      primaryLanguage,
      topWeaknessArea: weakTopics[0] || "Dynamic Programming",
    },
  };
}
