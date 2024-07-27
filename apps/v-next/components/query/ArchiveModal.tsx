'use client';
import { Tooltip } from '@mantine/core';
import { cn } from '@shared/fc';
import { GithubAPI, IUserRepoList } from '@shared/github-api';
import { useRequest } from 'ahooks';
import { ArchiveIcon } from 'lucide-react';
import toast from 'react-hot-toast';
import ConfirmModal from '../ConfirmModal';

interface ArchiveModalProps {
  selectedRows: IUserRepoList;
  mutate: (items: any) => void;
  accessToken: string;
}

export default function ArchiveModal({ selectedRows, mutate, accessToken }: ArchiveModalProps) {
  const { run, loading } = useRequest(
    () => {
      return Promise.allSettled(
        selectedRows
          .filter((i) => i.archived !== true)
          .map((i) =>
            GithubAPI.repo
              .patchRepo({
                auth: accessToken,
                owner: i.owner.login,
                repo: i.name,
                schema: {
                  archived: true
                }
              })
              .then(() => {
                toast.success(`Archived ${i.full_name}`);
                mutate((prevData: any) => {
                  return prevData.map((item: any) => {
                    if (item.id === i.id) {
                      return {
                        ...item,
                        archived: true
                      };
                    }
                    return item;
                  });
                });
              })
              .catch(() => {
                toast.error(`Failed to archived ${i.full_name}`);
              })
          )
      );
    },
    {
      manual: true
    }
  );

  return (
    <ConfirmModal title="Archive your selected repositories?" confirmFc={run} loading={loading}>
      <Tooltip label="batch archive">
        <ArchiveIcon
          size={22}
          className={cn('text-orange-500 mt-[5px]', {
            hidden: selectedRows.filter((i) => i.archived !== true).length === 0
          })}
        />
      </Tooltip>
    </ConfirmModal>
  );
}
