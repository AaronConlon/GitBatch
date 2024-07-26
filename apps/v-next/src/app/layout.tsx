import ContributeInfo from '@@/components/ContributeInfo';
import Profiles from '@@/components/Profiles';
import { SignIn } from '@@/components/sign-in';
import { PROJECT } from '@shared/consts';
import type { Metadata } from 'next';
import Image from 'next/image';
import './globals.css';

import { Roboto } from 'next/font/google';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

const roboto = Roboto({
  weight: '400',
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: `${PROJECT.name} - ${PROJECT.description}`,
  description: PROJECT.description,
  openGraph: {
    images: PROJECT.ogImage
  },
  twitter: {
    card: 'summary_large_image',
    title: 'https://batch-manage-github-repos.i5lin.top',
    description: PROJECT.description,
    creator: PROJECT.author.name,
    images: [PROJECT.ogImage],
    site: '@AaronConlonDev'
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="shortcut icon" href={PROJECT.imgs.logo} />
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-PEXEQY2N4L"></script>
        <script>
          {`window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-PEXEQY2N4L');`}
        </script>
      </head>
      <body className={`${roboto.className} flex flex-col min-h-screen w-full`}>
        <header className="flex justify-between max-w-full w-full md:w-[1200px] mx-auto py-4 px-8 xl:px-0 items-center">
          <Link href={'/'} className="flex items-center gap-4">
            <Image
              src={PROJECT.imgs.logo}
              alt="logo"
              width={64}
              height={64}
              className="hidden md:inline-block !rounded-full"
            />
            <Image
              src={PROJECT.imgs.logo}
              alt="logo"
              width={32}
              height={32}
              className="inline-block md:hidden"
            />
            <div>
              <div className="fancy-text text-2xl xl:text-3xl font-semibold">{PROJECT.name}</div>
              <p className="text-sm font-thin hidden md:block">{PROJECT.description}</p>
            </div>
          </Link>
          <SignIn />
        </header>
        {children}
        <footer className="py-8 xl:py-12 px-8 xl:px-0 bg-gradient-to-r from-gray-700 to-gray-900 text-white pb-24 mt-auto">
          <div className="grid gap-8 md:gap-24 pt-6 grid-cols-1 md:grid-cols-3 justify-center max-w-full md:w-[1200px] mx-auto">
            <div className="flex flex-col gap-4">
              <div className="text-lg">
                Created by @<span className="text-blue-500">{PROJECT.author.name}</span>
              </div>
              <p className="text-sm text-gray-50 w-[80%]">
                Quick and easy to use.Source code licensed under MIT.
              </p>
              <p className="uppercase">Copyright © 2024</p>
            </div>
            {/* contribute on github */}
            <ContributeInfo />
            <Profiles />
          </div>
        </footer>
        <Toaster />
      </body>
    </html>
  );
}
