import { auth, signIn, signOut } from '@@/auth';
import { PROJECT } from '@shared/consts';
import { Github, LogOut, MessageCircleHeartIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export async function SignIn() {
  const session = await auth();

  return (
    <form
      action={async () => {
        'use server';
        if (session) {
          await signOut();
        } else {
          await signIn('github');
        }
      }}
    >
      <div className="flex gap-2 items-center">
        {/* Feedback */}
        <Link
          className="hidden sm:flex items-center  gap-1 p-2 py-1 rounded-md cursor-pointer"
          target="_blank"
          href={`mailto:${PROJECT.author.email}`}
        >
          <MessageCircleHeartIcon size={16} color="#3b82f6" />
          <span className="">Feedback</span>
        </Link>

        <Link href={PROJECT.sourceCode} className="hidden sm:flex items-center gap-1">
          <Github size={16} color="#3b82f6" />
          <span>Code</span>
        </Link>

        <button type="submit" className="cursor-pointer">
          {session ? (
            <div className="flex items-center gap-1 p-1 rounded-md px-2">
              <LogOut size={16} color="#3b82f6" />
              <span>Logout</span>
            </div>
          ) : (
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-md px-2 py-1 flex items-center gap-1">
              <Github size={16} color="#fff" />
              <span className="hidden md:inline-block">Sign in with GitHub</span>
              <span className="inline-block md:hidden">Sign In</span>
            </div>
          )}
        </button>

        {/* user info */}
        {session && (
          <div className="grid grid-cols-1 sm:grid-cols-[auto_48px] gap-1 items-center ml-4">
            <div className="hidden md:flex gap-1 text-xl">
              hi,
              <span className="text-blue-400 font-semibold">{session?.user?.name}</span>
            </div>
            <Image src={session?.user?.image!} width={32} height={32} alt="avatar" />
          </div>
        )}
      </div>
    </form>
  );
}
