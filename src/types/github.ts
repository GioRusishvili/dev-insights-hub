export interface LanguageStats {
  language: string;
  bytes: number;
  percentage: number;
}

export interface CleanedGitHubStats {
  username: string;
  publicReposCount: number;
  topLanguages: LanguageStats[];
  recentCommits90Days: number;
}
