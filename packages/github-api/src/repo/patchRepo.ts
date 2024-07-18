import { Octokit } from 'octokit';

interface IPatchRepoInfoOptions {
  auth: string;
  schema: {
    name?: string;
    description?: string;
    homepage?: string;
    private?: boolean;
    archived?: boolean;
  };
  repo: string;
  owner: string;
}
export async function patchRepo({
  auth,
  schema,
  repo,
  owner,
}: IPatchRepoInfoOptions) {
  const octokit = new Octokit({
    auth,
  });

  await octokit.request('PATCH /repos/{owner}/{repo}', {
    owner,
    repo,
    ...schema,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  });
}
