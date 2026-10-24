import { CleanedLeetCodeStats } from "./leetcode";
import { CleanedGitHubStats } from "./github";

export interface UnifiedDeveloperMetrics {
  user: {
    leetcodeUsername: string;
    githubUsername: string;
  };
  leetcode: CleanedLeetCodeStats & {
    weakTopics: string[];
    strongTopics: string[];
  };
  github: CleanedGitHubStats;
  summary: {
    totalActivityScore: number;
    primaryLanguage: string;
    topWeaknessArea: string;
  };
}
