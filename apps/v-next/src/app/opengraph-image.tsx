import { PROJECT } from '@shared/consts';
import { ImageResponse } from 'next/og';
export const alt = PROJECT.description;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-end'
        }}
      >
        <div
          style={{
            fontSize: 48,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {PROJECT.name}
        </div>
        <div
          style={{
            fontSize: 24,
            background: 'white',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center'
          }}
        >
          {PROJECT.description}
        </div>
      </div>
    ),
    {
      ...size
    }
  );
}
