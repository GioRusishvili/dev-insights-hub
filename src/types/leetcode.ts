export interface LeetCodeTagCount {
  tagName: string;
  problemsSolved: number;
}

export interface RawLeetCodeResponse {
  data?: {
    matchedUser: {
      username: string;
      submitStatsGlobal: {
        acSubmissionNum: Array<{
          difficulty: string;
          count: number;
        }>;
      };
      tagProblemCounts: {
        fundamental: LeetCodeTagCount[];
        intermediate: LeetCodeTagCount[];
        advanced: LeetCodeTagCount[];
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
}

export interface CleanedLeetCodeStats {
  username: string;
  solvedTotal: number;
  solvedByDifficulty: {
    easy: number;
    medium: number;
    hard: number;
  };
  topicStats: Array<{
    topic: string;
    solved: number;
  }>;
}
