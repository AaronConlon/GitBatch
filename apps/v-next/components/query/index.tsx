'use client';

import { Button, Checkbox, Select, Skeleton, Switch, Table, TextInput } from '@mantine/core';
import { useForm } from '@mantine/form';
import { cn } from '@shared/fc';
import { GithubAPI, IGetRepoListFilter, IGithubRepository } from '@shared/github-api';
import { useRequest } from 'ahooks';
import { Star, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import DeleteModal from './DeleteModal';

interface IQueryProps {
  accessToken: string;
}

export default function Query({ accessToken }: IQueryProps) {
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  const router = useRouter();

  const searchParams = useSearchParams();
  const [name, setName] = useState('');

  const form = useForm({
    mode: 'uncontrolled',
    initialValues: Object.assign(
      {
        sort: 'created' as IGetRepoListFilter['sort'],
        page: 1,
        per_page: '30',
        direction: 'asc' as IGetRepoListFilter['direction']
      },
      searchParams
    ),
    onValuesChange: (value) => {
      setSelectedRows([]);
      const queryString = new URLSearchParams(value).toString();
      // change url
      setTimeout(() => {
        router.push(`/action?${queryString}`);
        refreshFCRef.current();
      }, 300);
    }
  });

  const refreshFCRef = useRef(() => {});
  const [isPatching, setIsPatching] = useState(false);

  const { data, refresh, loading } = useRequest(
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
        setIsPatching(false);
        setSelectedRows([]);
      }
    }
  );

  const changeRepoIsPrivate = (repository: IGithubRepository) => {
    try {
      // 防止重复提交
      if (isPatching) return;
      const { name, owner } = repository;
      return GithubAPI.repo
        .patchRepo({
          auth: accessToken,
          repo: name,
          owner: owner.login,
          schema: {
            private: !repository.private
          }
        })
        .then(() => {
          toast.success('Change the repository privacy successfully');
          refresh();
        });
    } catch (error) {
      // error info
      console.error(error);
      toast.error('Failed to change the repository privacy');
    } finally {
      setIsPatching(false);
    }
  };

  const changeRepoArchived = (repository: IGithubRepository) => {
    try {
      // 防止重复提交
      if (isPatching) return;
      const { name, owner } = repository;
      GithubAPI.repo
        .patchRepo({
          auth: accessToken,
          repo: name,
          owner: owner.login,
          schema: {
            archived: !repository.archived
          }
        })
        .then(() => {
          toast.success('Change the repository privacy successfully');
          refresh();
        });
    } catch (error) {
      // error info
      console.error(error);
      toast.error('Failed to change the repository privacy');
    } finally {
      setIsPatching(false);
    }
  };

  refreshFCRef.current = refresh;

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
        <Button className="btn btn-primary" loading={loading} onClick={refresh}>
          Search
        </Button>
      </form>

      <div className="my-4 relative">
        {data && data.length > 0 ? (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>
                  <DeleteModal
                    accessToken={accessToken}
                    selectedRows={data.filter((i) => selectedRows.includes(i.id))}
                    onSuccess={() => {
                      console.log('delete');
                      setSelectedRows([]);
                      refresh();
                    }}
                  />
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
                .map(
                  ({
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
                  }) => {
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
                          <Switch
                            onLabel="YES"
                            defaultChecked={isPrivate}
                            disabled={isPatching}
                            onChange={(e) => {
                              changeRepoIsPrivate(data.find((i) => i.id === id)!);
                            }}
                          />
                        </Table.Td>
                        <Table.Td>
                          <Switch
                            onLabel="YES"
                            defaultChecked={archived}
                            disabled={isPatching}
                            onChange={(e) => {
                              changeRepoArchived(data.find((i) => i.id === id)!);
                            }}
                          />
                        </Table.Td>
                        <Table.Td className="hidden md:table-cell">
                          <textarea
                            className="block w-full border-none bg-transparent outline-none resize-none"
                            defaultValue={description}
                            onBlur={(e) => {
                              const { value } = e.target;
                              if (value !== description) {
                                GithubAPI.repo
                                  .patchRepo({
                                    auth: accessToken,
                                    repo: name,
                                    owner: owner.login,
                                    schema: {
                                      description: value
                                    }
                                  })
                                  .then(() => {
                                    toast.success('Change the repository description successfully');
                                    refresh();
                                  })
                                  .catch((error) => {
                                    // error info
                                    console.error(error);
                                    toast.error('Failed to change the repository description');
                                  });
                              }
                            }}
                          />
                        </Table.Td>
                        <Table.Td className="hidden md:table-cell">{stargazers_count}</Table.Td>
                        <Table.Td className="hidden md:table-cell">{forks_count}</Table.Td>
                        <Table.Td className="hidden md:table-cell">
                          <button
                            className="opacity-0 group-hover:opacity-100 text-red-500 pt-1 flex gap-1 items-center"
                            disabled={isPatching}
                            onClick={async () => {
                              try {
                                setIsPatching(true);
                                await GithubAPI.repo.removeRepo({
                                  auth: accessToken,
                                  repo: name,
                                  owner: owner.login
                                });
                                toast.success('Delete the repository successfully');
                                refresh();
                              } catch (error) {
                                // error info
                                console.error(error);
                                toast.error('Failed to delete the repository');
                              } finally {
                                setIsPatching(false);
                              }
                            }}
                          >
                            <Trash2 size={16} />
                          </button>
                        </Table.Td>
                      </Table.Tr>
                    );
                  }
                )}
            </Table.Tbody>
          </Table>
        ) : (
          <div className="min-h-[50vh]">
            <Skeleton height={24} radius="xl" />
            <Skeleton height={24} mt={6} radius="xl" />
            <Skeleton height={24} mt={6} width="70%" radius="xl" />
          </div>
        )}
      </div>
    </div>
  );
}
