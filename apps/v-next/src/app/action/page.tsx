'use server';

import { auth } from '@@/auth';
import Query from '@@/components/query';
import { Session } from 'next-auth';
import Image from 'next/image';

// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import { createTheme, MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
const theme = createTheme({
  /** Put your mantine theme override here */
});

export default async function Page() {
  const session = (await auth()) as
    | (Session & {
        accessToken: string;
      })
    | null;

  console.log('session:', session);

  if (session === null) {
    return (
      <div className="text-center py-48 flex flex-col gap-12 justify-center items-center">
        <Image src="/login-tip.svg" alt="login-tip" width={400} height={320} />
        <div>Oops!You have not login...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-gray-50 flex-grow w-full">
      <MantineProvider theme={theme}>
        <div className="w-[1440px] max-w-full mx-auto p-4">
          <Query accessToken={session['accessToken']} />
        </div>
      </MantineProvider>
    </div>
  );
}
