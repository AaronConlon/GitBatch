import { Octokit } from 'octokit';
import { IGithubRepository } from '../type';

interface ICreateRepoOptions {
  auth: string;
  schema: {
    name: string;
    description?: string;
    homepage?: string;
    private?: boolean;
    archived?: boolean;
  };
}
export async function create({
  auth,
  schema,
}: ICreateRepoOptions): Promise<IGithubRepository> {
  const octokit = new Octokit({ auth });
  return await octokit.request('POST /user/repos', schema);
}
