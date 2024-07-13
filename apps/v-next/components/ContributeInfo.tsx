'use client';

import { GithubAPI } from '@shared/github-api';
import { useRequest } from 'ahooks';
import { Github } from 'lucide-react';

export default function ContributeInfo() {
  const repoInfo = useRequest(
    () => GithubAPI.repo.getRepoInfoByName('Developer27149', 'delete-github-repos-in-batches'),
    {
      cacheKey: 'repo-info',
      manual: true
    }
  );

  const userInfo = useRequest(() => GithubAPI.user.getUserInfoByName('Developer27149'), {
    cacheKey: 'user-info'
  });

  return (
    <div className="text-black font-semibold flex flex-col gap-4">
      <div>Contribute on GitHub</div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 bg-gray-50 border border-solid border-gray-200 rounded-md p-0.5 px-1">
          <Github size={16} />
          Star
        </button>
        <span className="font-thin relative bg-gray-50 border border-solid border-gray-200 rounded-md p-0.5 px-1">
          <span className="absolute top-[50%] transform translate-y-[-50%] -left-4 border-[8px] border-transparent border-r-gray-200 border-solid"></span>
          <span className="absolute top-[50%] transform translate-y-[-50%] -left-3 border-[6px] border-transparent border-r-gray-50 border-solid"></span>
          {repoInfo.data?.stargazers_count ?? 0}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <button className="flex items-center gap-1 bg-gray-50 border border-solid border-gray-200 rounded-md p-0.5 px-1">
          <Github size={16} />
          <section className="truncate">Follow @Developer27149</section>
        </button>
        <span className="font-thin relative bg-gray-50 border border-solid border-gray-200 rounded-md p-0.5 px-1">
          <span className="absolute top-[50%] transform translate-y-[-50%] -left-4 border-[8px] border-transparent border-r-gray-200 border-solid"></span>
          <span className="absolute top-[50%] transform translate-y-[-50%] -left-3 border-[6px] border-transparent border-r-gray-50 border-solid"></span>
          {userInfo.data?.followers ?? 0}
        </span>
      </div>
    </div>
  );
}
