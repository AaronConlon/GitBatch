import { Octokit } from 'octokit';

// 创建Octokit实例，无需提供认证令牌
const octokit = new Octokit();

/**
 * 使用 octokit 获取用户信息
 * 根据用户名获取用户信息
 */
export const getUserInfoByName = async (username: string) => {
  try {
    // 使用Octokit调用GitHub API获取用户信息
    const response = await octokit.request('GET /users/{username}', {
      username,
    });
    // 返回用户信息
    return response.data as {
      name: string;
      login: string;
      avatar_url: string;
      bio: string;
      public_repos: number;
      followers: number;
      following: number;
    };
  } catch (error) {
    console.error('Error fetching user information:', error);
    return null; // 或者根据你的错误处理策略返回其他值
  }
};
