import { Octokit } from 'octokit';

interface IRemoveOptions {
  owner: string;
  repo: string;
  auth: string;
}

/**
 * remove repo
 */
export async function removeRepo({ auth, owner, repo }: IRemoveOptions) {
  const octokit = new Octokit({ auth });
  await octokit.request('DELETE /repos/{owner}/{repo}', {
    owner,
    repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}
