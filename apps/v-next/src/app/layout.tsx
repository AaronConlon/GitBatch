import ContributeInfo from "@@/components/ContributeInfo";
import ShareTo from "@@/components/ShareTo";
import { SignIn } from "@@/components/sign-in";
import { PROJECT } from "@shared/consts";
import type { Metadata } from "next";
import Image from "next/image";
import "./globals.css";

import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Delete warehouses in batches",
  description: "Delete warehouses in batches.Quick and easy to use.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/shandian.svg" />
      </head>
      <body className={roboto.className}>
        <header className="flex justify-between max-w-[100vw] w-full md:w-[1200px] mx-auto py-4 px-8 xl:px-0 items-center">
          <div className="flex items-center gap-4">
            <Image
              src="/shandian.svg"
              alt="logo"
              width={64}
              height={64}
              className="hidden md:inline-block !rounded-full"
            />
            <Image
              src="/shandian.svg"
              alt="logo"
              width={32}
              height={32}
              className="inline-block md:hidden"
            />
            <div className="fancy-text text-2xl xl:text-3xl font-semibold uppercase">
              Delete & Archive
            </div>
          </div>
          <SignIn />
        </header>
        {children}
        <footer className="py-8 xl:py-12 px-8 xl:px-0 bg-gray-50 pb-24">
          <div className="grid gap-8 md:gap-24 pt-6 grid-cols-1 md:grid-cols-3 justify-center max-w-[100vw] w-full md:w-[1200px] mx-auto">
            <div className="flex flex-col gap-4">
              <div className="text-lg">
                Created by{" "}
                <span className="text-blue-500">{PROJECT.author.name}</span>
              </div>
              <p className="text-sm text-gray-500 w-[80%]">
                Quick and easy to use.Source code licensed under MIT.
              </p>
              <p className="uppercase">Copyright © 2024</p>
            </div>
            {/* contribute on github */}
            <ContributeInfo />
            <ShareTo />
          </div>
        </footer>
      </body>
    </html>
  );
}
