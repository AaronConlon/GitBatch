'use client';
import { Button, Modal, Textarea } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { GithubAPI, IGithubRepository } from '@shared/github-api';
import { useRequest } from 'ahooks';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface DeleteModalProps {
  accessToken: string;
  description?: string;
  repoItem: IGithubRepository;
}

export default function DescriptionModal({ description = '', accessToken, repoItem }: DeleteModalProps) {
  const [opened, { open, close }] = useDisclosure(false);
  const [value, setValue] = useState('');

  useEffect(() => {
    setValue(description);
  }, [description]);

  const { run, loading, cancel } = useRequest(
    async () => {
      await GithubAPI.repo.patchRepo({
        auth: accessToken,
        repo: repoItem.name,
        owner: repoItem.owner.login,
        schema: {
          description: value
        }
      });
      toast.success('Change the repository description successfully');
      setValue(value);
    },
    {
      manual: true
    }
  );

  const onClose = () => {
    cancel();
    close();
  };

  return (
    <>
      <Modal opened={opened} onClose={onClose} title="Modify the description:" centered>
        {/* Modal content */}
        <Textarea value={value} onChange={(e) => setValue(e.target.value)} className="pb-12" rows={4} />
        <div>
          <div className="mt-4 flex justify-end gap-2 items-center">
            <Button variant="outline" size="sm" onClick={onClose}>
              Cancel
            </Button>
            <Button size="sm" onClick={run} disabled={loading} loading={loading}>
              Confirm
            </Button>
          </div>
        </div>
      </Modal>

      <div className="cursor-pointer" onClick={open}>
        {value}
      </div>
    </>
  );
}
