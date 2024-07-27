'use client';

import { Button, Checkbox, Select, Skeleton, Switch, Table, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { cn } from '@shared/fc';
import { GithubAPI, IGetRepoListFilter, IGithubRepository } from '@shared/github-api';
import { useRequest } from 'ahooks';
import { debounce } from 'lodash-es';
import { Search, Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import ConfirmModal from '../ConfirmModal';
import ArchiveModal from './ArchiveModal';
import DeleteModal from './DeleteModal';
import DescriptionModal from './DescriptionModal';

interface IQueryProps {
  accessToken: string;
}

export default function Query({ accessToken }: IQueryProps) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const router = useRouter();

  const searchParams = useSearchParams();
  const [name, setName] = useState('');
  const generateTempRepo = async () => {
    for (let i = 0; i < 4; i++) {
      await GithubAPI.repo.create({
        auth: accessToken,
        schema: {
          name: `temp-repo-${i}`,
          description: 'This is a temp repo',
          private: false,
          archived: false
        }
      });
    }
    toast.success('Create temp repos successfully');
    refresh();
  };

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: Object.assign(
      {
        sort: 'created' as IGetRepoListFilter['sort'],
        page: 1,
        per_page: '30',
        direction: 'desc' as IGetRepoListFilter['direction']
      },
      searchParams
    ),
    onValuesChange: (value) => {
      setSelectedRows([]);
      const queryString = new URLSearchParams(value).toString();
      router.push(`/action?${queryString}`);
    }
  });

  const { data, refresh, loading, mutate } = useRequest(
    () =>
      GithubAPI.repo.getUserRepos({
        auth: accessToken,
        filter: {
          ...form.getValues(),
          per_page: parseInt(form.getValues().per_page)
        }
      }),
    {
      onSuccess: () => {
        setSelectedRows([]);
      }
    }
  );

  const deleteRepo = useRequest(
    async ({ id, owner, name }: { id: number; name: string; owner: IGithubRepository['owner'] }) => {
      try {
        await GithubAPI.repo.removeRepo({
          auth: accessToken,
          repo: name,
          owner: owner.login
        });
        toast.success('Delete the repository successfully');
        data && mutate(data.filter((i) => i.id !== id));
      } catch (error) {
        // error info
        console.error(error);
        toast.error('Failed to delete the repository');
      }
    },
    {
      manual: true
    }
  );

  const changeRepoIsPrivate = debounce((repository: IGithubRepository, isPrivate: boolean) => {
    try {
      if (isPrivate === repository.private) return;
      const { name, owner } = repository;
      return GithubAPI.repo
        .patchRepo({
          auth: accessToken,
          repo: name,
          owner: owner.login,
          schema: {
            private: isPrivate
          }
        })
        .then(() => {
          toast.success('Change the repository privacy successfully');
          mutate((data) => data!.map((i) => (i.id === repository.id ? { ...i, private: !i.private } : i)));
        });
    } catch (error) {
      // error info
      console.error(error);
      toast.error('Failed to change the repository privacy');
    }
  }, 300);

  const changeRepoArchived = debounce(async (repository: IGithubRepository, archived: boolean) => {
    try {
      if (repository.archived === archived) return;
      const { name, owner } = repository;
      await GithubAPI.repo.patchRepo({
        auth: accessToken,
        repo: name,
        owner: owner.login,
        schema: {
          archived: !repository.archived
        }
      });
      toast.success('Change the repository privacy successfully');
      mutate((data) => data!.map((i) => (i.id === repository.id ? { ...i, archived: !i.archived } : i)));
    } catch (error) {
      // error info
      console.error(error);
      toast.error('Failed to change the repository privacy');
    }
  }, 300);

  return (
    <div>
      <form
        onSubmit={form.onSubmit((values) => console.log(values))}
        className="flex flex-wrap items-end gap-4 sticky top-0 bg-gray-50 z-[1] py-2"
      >
        {/* query by name */}
        <TextInput
          placeholder="search..."
          label="name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
        <Select
          label="per page"
          placeholder="Pick value"
          data={['10', '30', '50', '100']}
          className="w-24"
          clearable={false}
          {...form.getInputProps('per_page')}
        />
        <Select
          label="sort"
          className="w-32"
          placeholder="Pick value"
          data={['created', 'updated', 'pushed']}
          clearable={false}
          {...form.getInputProps('sort')}
        />
        <Select
          className="w-24"
          label="direction"
          placeholder="Pick value"
          data={['asc', 'desc']}
          key={form.key('direction')}
          clearable={false}
          {...form.getInputProps('direction')}
        />
        <Button className="btn btn-primary" onClick={refresh}>
          <Search size={16} className="mr-1" />
          Search
        </Button>
        {/* it's debug code... */}
        <Button variant="outline" onClick={generateTempRepo} className="!hidden">
          Create temp repos
        </Button>
      </form>

      <div className="my-4 relative bg-white">
        {data && !loading ? (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <div className="flex items-center min-w-12">
                    <DeleteModal
                      accessToken={accessToken}
                      selectedRows={data.filter((i) => selectedRows.includes(i.id))}
                      removeItem={(id: number) => {
                        setSelectedRows(selectedRows.filter((i) => i !== id));
                        mutate((data) => data!.filter((i) => i.id !== id));
                      }}
                    />
                    <ArchiveModal
                      accessToken={accessToken}
                      selectedRows={data.filter((i) => selectedRows.includes(i.id))}
                      mutate={mutate}
                    />
                  </div>
                </Table.Th>
                <Table.Th>Full Name</Table.Th>
                <Table.Th>Private</Table.Th>
                <Table.Th>Archive</Table.Th>
                <Table.Th className="hidden md:table-cell">Description</Table.Th>
                <Table.Th className="hidden md:table-cell">
                  <Star size={16} />
                </Table.Th>
                <Table.Th className="hidden md:table-cell">
                  <span>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 512 512">
                      <path
                        fill="currentColor"
                        d="m297.278 511.735l-.394-58.29c0-46.911 55.674-29.88 47.228-102.872L328.399 77.95c-.517-12.215-15.196-12.442-14.746-.222l-2.39 233.44c-1.214 19.023-23.778 15.874-23.06-4.124l-2.9-229.578c0-13.7-14.26-10.933-14.393 1.012l-3.891 234.168c-.455 14.918-22.522 13.467-22.06-.7l-3.306-234.854c0-10.6-13.59-11.645-13.875-1.26l-3.973 237.137c-1.06 16.197-22.854 14.018-21.725-3.474L199.351 77.76c.175-13.084-13.245-12.399-13.864 0l-17.786 284.25c-.418 61.217 47.152 41.87 48.233 94.188l-.06 55.802c-173.6-26.828-273.41-226.037-180.238-385.311c99.738-170.498 346.484-168.508 443.076 3.572c89.219 158.944-10.914 353.883-181.434 381.474"
                      />
                    </svg>
                  </span>
                </Table.Th>
                <Table.Th></Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {data
                .filter((i) => i.full_name.toLowerCase().includes(name.toLowerCase().trim()))
                .map((item) => {
                  const {
                    name,
                    id,
                    private: isPrivate,
                    stargazers_count,
                    forks_count,
                    fork,
                    description,
                    archived,
                    html_url,
                    owner
                  } = item;
                  return (
                    <Table.Tr
                      key={name}
                      className={cn(
                        'hover:from-white hover:to-indigo-100 bg-gradient-to-l group text-gray-800 hover:text-black',
                        {
                          'text-black to-indigo-50 from-white': selectedRows.includes(id)
                        }
                      )}
                    >
                      <Table.Td>
                        <Checkbox
                          aria-label="Select row"
                          checked={selectedRows.includes(id)}
                          onChange={(event) =>
                            setSelectedRows(
                              event.currentTarget.checked
                                ? [...selectedRows, id]
                                : selectedRows.filter((_id) => _id !== id)
                            )
                          }
                        />
                      </Table.Td>
                      <Table.Td>
                        <Link
                          href={html_url}
                          target="_blank"
                          className="flex gap-1 min-w-[120px] items-center"
                        >
                          <span>{name}</span>
                          {fork && (
                            <span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 512 512"
                              >
                                <path
                                  fill="currentColor"
                                  d="m297.278 511.735l-.394-58.29c0-46.911 55.674-29.88 47.228-102.872L328.399 77.95c-.517-12.215-15.196-12.442-14.746-.222l-2.39 233.44c-1.214 19.023-23.778 15.874-23.06-4.124l-2.9-229.578c0-13.7-14.26-10.933-14.393 1.012l-3.891 234.168c-.455 14.918-22.522 13.467-22.06-.7l-3.306-234.854c0-10.6-13.59-11.645-13.875-1.26l-3.973 237.137c-1.06 16.197-22.854 14.018-21.725-3.474L199.351 77.76c.175-13.084-13.245-12.399-13.864 0l-17.786 284.25c-.418 61.217 47.152 41.87 48.233 94.188l-.06 55.802c-173.6-26.828-273.41-226.037-180.238-385.311c99.738-170.498 346.484-168.508 443.076 3.572c89.219 158.944-10.914 353.883-181.434 381.474"
                                />
                              </svg>
                            </span>
                          )}
                        </Link>
                      </Table.Td>
                      <Table.Td>
                        {!archived && (
                          <Switch
                            onLabel="YES"
                            checked={isPrivate}
                            disabled={archived}
                            onChange={(e) => {
                              changeRepoIsPrivate(data.find((i) => i.id === id)!, e.target.checked);
                            }}
                          />
                        )}
                      </Table.Td>
                      <Table.Td>
                        <Switch
                          onLabel="YES"
                          checked={archived}
                          onChange={(e) => {
                            changeRepoArchived(data.find((i) => i.id === id)!, e.target.checked);
                          }}
                        />
                      </Table.Td>
                      <Table.Td className="hidden md:table-cell">
                        <DescriptionModal
                          accessToken={accessToken}
                          description={description}
                          repoItem={item}
                          updateDescription={(text: string) => {
                            data && mutate(data.map((i) => (i.id === id ? { ...i, description: text } : i)));
                          }}
                        />
                      </Table.Td>
                      <Table.Td className="hidden md:table-cell text-center">{stargazers_count}</Table.Td>
                      <Table.Td className="hidden md:table-cell text-center">{forks_count}</Table.Td>
                      <Table.Td className="hidden md:table-cell">
                        <ConfirmModal
                          title={
                            <div>
                              Delete: <span className="text-red-500 text-sm font-thin px-2">{name}</span>
                            </div>
                          }
                          confirmFc={() =>
                            deleteRepo.run({
                              id,
                              name,
                              owner
                            })
                          }
                          loading={deleteRepo.loading}
                        >
                          <Trash2 size={16} className="opacity-0 group-hover:opacity-100 text-red-500 mt-2" />
                        </ConfirmModal>
                      </Table.Td>
                    </Table.Tr>
                  );
                })}
            </Table.Tbody>
          </Table>
        ) : (
          <div className="min-h-[50vh] p-2">
            <Skeleton height={24} radius="xl" />
            <Skeleton height={24} mt={6} radius="xl" />
            <Skeleton height={24} mt={6} width="70%" radius="xl" />
          </div>
        )}
      </div>
    </div>
  );
}
