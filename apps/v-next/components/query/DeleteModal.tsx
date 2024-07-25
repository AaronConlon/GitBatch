'use client';
import { Button, List, Modal, rem, ThemeIcon } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { cn } from '@shared/fc';
import { GithubAPI, IUserRepoList } from '@shared/github-api';
import { useRequest } from 'ahooks';
import { CheckCircle, RefreshCcw, Trash2 } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface DeleteModalProps {
  selectedRows: IUserRepoList;
  onSuccess: (ids: number[]) => void;
  accessToken: string;
}

export default function DeleteModal({ selectedRows, onSuccess, accessToken }: DeleteModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [deletedIds, setDeletedIds] = useState<number[]>([]);

  const { run, loading, cancel } = useRequest(
    () => {
      return Promise.allSettled(
        selectedRows
          .filter((i) => !deletedIds.includes(i.id))
          .map((i) =>
            GithubAPI.repo
              .removeRepo({
                auth: accessToken,
                owner: i.owner.login,
                repo: i.name
              })
              .then(() => {
                setDeletedIds((prev) => {
                  if (prev.includes(i.id)) {
                    return prev;
                  }
                  return [...prev, i.id];
                });
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
        console.log('deleted:', deletedIds);
        onSuccess(deletedIds);
      }
    }
  );

  const onClose = () => {
    cancel();
    setDeletedIds([]);
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
                <List.Item
                  key={repo.id}
                  icon={
                    deletedIds.includes(repo.id) ? (
                      <ThemeIcon color="red" size={24} radius="xl">
                        <CheckCircle style={{ width: rem(16), height: rem(16) }} />
                      </ThemeIcon>
                    ) : undefined
                  }
                >
                  <span
                    className={cn({
                      'line-through': deletedIds.includes(repo.id)
                    })}
                  >
                    {repo.full_name}
                  </span>
                </List.Item>
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
            <Button size="sm" onClick={onClose}>
              {deletedIds.map((i) => i.toString()).join('-') ===
              selectedRows.map((i) => i.id.toString()).join('-')
                ? 'Close'
                : 'Cancel'}
            </Button>
            <Button
              onClick={run}
              size="sm"
              variant="outline"
              color="red"
              disabled={
                deletedIds.map((i) => i.toString()).join('-') ===
                selectedRows.map((i) => i.id.toString()).join('-')
              }
            >
              Delete
            </Button>
          </div>
        </div>
      </Modal>

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
    </>
  );
}
