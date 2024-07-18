import { PROJECT } from '@shared/consts';
import { UserPen } from 'lucide-react';
import Image from 'next/image';

export default function Profiles() {
  const siteMap: Record<string, string> = {
    twitter: '/twitter.svg',
    github: '/github.svg'
  };

  return (
    <div className="font-semibold flex flex-col gap-4">
      <div>Profiles</div>
      {PROJECT.author.sites.map(({ name, url }) => {
        const src = siteMap[name];
        return (
          <a key={name} href={url} target="_blank" rel="noreferrer" className="flex items-center gap-2">
            {src ? (
              <Image src={src} alt="avatar" width={24} height={24} className="p-1 bg-white rounded-full" />
            ) : name === 'blog' ? (
              <UserPen size={24} className="p-1 bg-white text-black rounded-full" />
            ) : null}
            <span>{name}</span>
          </a>
        );
      })}
    </div>
  );
}
