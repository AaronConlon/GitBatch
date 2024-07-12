import { PROJECT } from "@shared/consts";
import Image from "next/image";

export default function ShareTo() {
  const socialMediaLogoMap: Record<string, string> = {
    twitter: "/twitter.svg",
    github: "/github.svg",
  };

  return (
    <div className="text-black font-semibold flex flex-col gap-4">
      <div>Share</div>
      {PROJECT.author.socialMedia.map(({ name, url }) => {
        const src = socialMediaLogoMap[name];
        return (
          <a
            key={name}
            href={url}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2"
          >
            <Image src={src} alt="avatar" width={24} height={24} />
            <span>{name}</span>
          </a>
        );
      })}
    </div>
  );
}
