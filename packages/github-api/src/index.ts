import { getRepoInfoByName } from './repo';
import { getUserInfoByName } from './user';

export const GithubAPI = {
  repo: {
    getRepoInfoByName,
  },
  user: {
    getUserInfoByName,
  },
};
