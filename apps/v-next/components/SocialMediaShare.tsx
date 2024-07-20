'use client';

import { PROJECT } from '@shared/consts';
import {
  FacebookIcon,
  FacebookShareButton,
  LineIcon,
  LineShareButton,
  PinterestIcon,
  PinterestShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton
} from 'next-share';

import { WeiboIcon, WeiboShareButton } from 'next-share';
import { useState } from 'react';

export default function SocialMediaShare() {
  const title = `${PROJECT.name} - ${PROJECT.description}`;
  const [url] = useState(`https://${globalThis?.location?.hostname}`);

  return (
    <div className="p-4 mt-12">
      <div className="font-semibold uppercase pb-2">You like us? Tell your friends 🥰</div>
      <div className="flex items-center gap-1 sm:gap-1.5 xl:gap-2">
        <TwitterShareButton url={url} title={title} blankTarget>
          <TwitterIcon size={32} round />
        </TwitterShareButton>

        <TelegramShareButton blankTarget url={url} title={title}>
          <TelegramIcon size={32} round />
        </TelegramShareButton>

        <LineShareButton url={url} title={title} blankTarget>
          <LineIcon size={32} round />
        </LineShareButton>

        <FacebookShareButton url={url} quote={title} hashtag={'#nextshare'} blankTarget>
          <FacebookIcon size={32} round />
        </FacebookShareButton>

        <PinterestShareButton url={url} media={title} blankTarget>
          <PinterestIcon size={32} round />
        </PinterestShareButton>

        <WeiboShareButton url={url} blankTarget title={title} image={`${url}/shandian.svg`}>
          <WeiboIcon size={32} round />
        </WeiboShareButton>
      </div>
    </div>
  );
}
