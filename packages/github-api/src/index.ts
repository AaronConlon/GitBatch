export * from './type';

import {
  create,
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
    create,
  },
  user: {
    getUserInfoByName,
  },
};
