export * from './type';

import {
  getRepoInfoByName,
  getUserRepos,
  patchRepo,
  removeRepo,
  starred,
} from './repo';
import { getUserInfoByName } from './user';

export const GithubAPI = {
  repo: {
    getRepoInfoByName,
    getUserRepos,
    removeRepo,
    patchRepo,
    starred,
  },
  user: {
    getUserInfoByName,
  },
};
