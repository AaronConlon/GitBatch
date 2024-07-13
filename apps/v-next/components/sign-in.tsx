import { auth, signIn, signOut } from '@@/auth';
import { PROJECT } from '@shared/consts';
import { LogOut, MessageCircleHeartIcon } from 'lucide-react';
import Image from 'next/image';

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
        <a
          className="hidden sm:flex items-center  gap-1 p-2 py-1 rounded-md  cursor-pointer"
          target="_blank"
          href={`mailto:${PROJECT.author.email}`}
        >
          <MessageCircleHeartIcon size={16} color="#3b82f6" />
          <span className="">Feedback</span>
        </a>

        <button type="submit" className="cursor-pointer">
          {session ? (
            <div className="flex items-center gap-1 p-1 rounded-md px-2">
              <LogOut size={16} color="#3b82f6" />
              <span>Logout</span>
            </div>
          ) : (
            'Sign in with GitHub'
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
