'use client';
import { Button, List, Modal, rem, ThemeIcon, Tooltip } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { cn } from '@shared/fc';
import { GithubAPI, IUserRepoList } from '@shared/github-api';
import { useRequest } from 'ahooks';
import { RefreshCcw, Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface DeleteModalProps {
  selectedRows: IUserRepoList;
  removeItem: (id: number) => void;
  accessToken: string;
}

export default function DeleteModal({ selectedRows, removeItem, accessToken }: DeleteModalProps) {
  const [opened, { open, close }] = useDisclosure(false);

  const { run, loading, cancel } = useRequest(
    () => {
      if (selectedRows.length === 0) {
        close();
      }

      return Promise.allSettled(
        selectedRows.map((i) =>
          GithubAPI.repo
            .removeRepo({
              auth: accessToken,
              owner: i.owner.login,
              repo: i.name
            })
            .then(() => {
              toast.success(`Deleted ${i.full_name}`);
              removeItem(i.id);
            })
            .catch(() => {
              toast.error(`Failed to delete ${i.full_name}`);
            })
        )
      );
    },
    {
      manual: true,
      onSuccess: () => {
        close();
      }
    }
  );

  const onClose = () => {
    cancel();
    close();
  };

  return (
    <>
      <Modal opened={opened} onClose={onClose} title="Are you sure?" centered>
        {/* Modal content */}
        <div>
          <p className="pb-4">
            You are about to delete the following {selectedRows.length} repositories. This action cannot be
            undone.
          </p>
          <div className="flex items-center gap-2">
            <List
              spacing="xs"
              size="sm"
              center
              icon={
                <ThemeIcon color={loading ? 'indigo' : 'gray'} size={24} radius="xl">
                  <RefreshCcw
                    style={{ width: rem(16), height: rem(16) }}
                    className={cn({
                      'animate-spin': loading
                    })}
                  />
                </ThemeIcon>
              }
            >
              {selectedRows.map((repo) => (
                <List.Item key={repo.id}>{repo.full_name}</List.Item>
              ))}
            </List>
          </div>
          <div className="mt-4 flex justify-end gap-2 items-center">
            <a
              className='underline text-green-600 text-sm font-thin flex" items-center flex-wrap mr-auto'
              href="
            https://docs.github.com/en/repositories/creating-and-managing-repositories/restoring-a-deleted-repository            "
            >
              Restore tips
            </a>
            <Button size="sm" onClick={onClose} variant="outline">
              Cancel
            </Button>
            <Button onClick={run} size="sm" color="red">
              Delete
            </Button>
          </div>
        </div>
      </Modal>

      <Tooltip label="batch delete">
        <button
          onClick={() => {
            if (selectedRows.length) {
              open();
            }
          }}
          className={cn('text-red-500 pt-1 flex gap-1 items-center', {
            'opacity-0': selectedRows.length === 0
          })}
        >
          <Trash2 size={22} />
        </button>
      </Tooltip>
    </>
  );
}
