import { Octokit } from 'octokit';

// 创建Octokit实例，无需提供认证令牌
const octokit = new Octokit();

/**
 * 示例调用
 * ```ts
 * getRepoInfoByName("octocat", "Hello-World").then(repoInfo => {
    if (repoInfo) {
      console.log(repoInfo);
    } else {
      console.log("Failed to fetch repository information.");
    }
  });
```
 * 
 * @param owner 
 * @param repo 
 * @returns 
 */
export const getRepoInfoByName = async (owner: string, repo: string) => {
  try {
    // 使用Octokit调用GitHub API获取仓库信息
    const response = await octokit.request('GET /repos/{owner}/{repo}', {
      owner,
      repo,
    });
    // 返回仓库信息
    return response.data as {
      stargazers_count: number;
      watchers_count: number;
      forks_count: number;
      open_issues_count: number;
    };
  } catch (error) {
    console.error('Error fetching repository information:', error);
    return null; // 或者根据你的错误处理策略返回其他值
  }
};
