import { RawLeetCodeResponse, CleanedLeetCodeStats } from "@/types/leetcode";

const LEETCODE_GRAPHQL_ENDPOINT = "https://leetcode.com/graphql";

const USER_STATS_QUERY = `
  query getUserLeetCodeStats($username: String!) {
    matchedUser(username: $username) {
      username
      submitStatsGlobal {
        acSubmissionNum {
          difficulty
          count
        }
      }
      tagProblemCounts {
        fundamental {
          tagName
          problemsSolved
        }
        intermediate {
          tagName
          problemsSolved
        }
        advanced {
          tagName
          problemsSolved
        }
      }
    }
  }
`;

export async function fetchLeetCodeStats(username: string): Promise<CleanedLeetCodeStats> {
  const response = await fetch(LEETCODE_GRAPHQL_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Referer: "https://leetcode.com",
    },
    body: JSON.stringify({
      query: USER_STATS_QUERY,
      variables: { username },
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`LeetCode API HTTP error! Status: ${response.status}`);
  }

  const result: RawLeetCodeResponse = await response.json();

  if (result.errors && result.errors.length > 0) {
    throw new Error(`LeetCode GraphQL error: ${result.errors[0].message}`);
  }

  if (!result.data || !result.data.matchedUser) {
    throw new Error(`LeetCode user "${username}" was not found or profile is private.`);
  }

  const { matchedUser } = result.data;

  // Extract problem counts by difficulty level
  const difficultyMap = matchedUser.submitStatsGlobal.acSubmissionNum.reduce(
    (acc, item) => {
      const key = item.difficulty.toLowerCase();
      if (key in acc) {
        acc[key as keyof typeof acc] = item.count;
      }
      return acc;
    },
    { easy: 0, medium: 0, hard: 0 }
  );

  const totalSolved =
    matchedUser.submitStatsGlobal.acSubmissionNum.find(
      (item) => item.difficulty === "All"
    )?.count ?? (difficultyMap.easy + difficultyMap.medium + difficultyMap.hard);

  // Flatten topic tags across fundamental, intermediate, and advanced categories
  const rawTopics = [
    ...(matchedUser.tagProblemCounts.fundamental || []),
    ...(matchedUser.tagProblemCounts.intermediate || []),
    ...(matchedUser.tagProblemCounts.advanced || []),
  ];

  const topicStats = rawTopics
    .map((t) => ({ topic: t.tagName, solved: t.problemsSolved }))
    .sort((a, b) => b.solved - a.solved);

  return {
    username: matchedUser.username,
    solvedTotal: totalSolved,
    solvedByDifficulty: difficultyMap,
    topicStats,
  };
}
