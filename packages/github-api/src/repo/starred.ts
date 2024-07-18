import { Octokit } from 'octokit';

export function starred(options: {
  owner: string;
  repo: string;
  auth: string;
}) {
  const { owner, repo, auth } = options;
  const octokit = new Octokit({ auth });
  return octokit.request('PUT /user/starred/{owner}/{repo}', {
    owner,
    repo,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}
