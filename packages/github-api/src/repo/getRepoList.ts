import { Octokit } from 'octokit';
import qs from 'query-string';
import { IGetRepoListFilter, IUserRepoList } from '../type';
/**
 * query user's repo list by filter
 */
export async function getUserRepos(options: {
  filter?: IGetRepoListFilter;
  auth?: string;
}) {
  const { auth, filter } = Object.assign({}, options);
  // 创建Octokit实例，无需提供认证令牌
  const octokit = new Octokit({
    auth: auth,
  });
  const resp = await octokit.request(
    `GET /user/repos?${qs.stringify({
      ...filter,
      affiliation: 'owner',
    })}`
  );
  return resp.data as IUserRepoList;
}
