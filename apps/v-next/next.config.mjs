/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        // github
        hostname: 'avatars.githubusercontent.com',
        protocol: 'https'
      },
      {
        // image bed
        hostname: 'de4965e.webp.li',
        protocol: 'https'
      }
    ]
  }
};

export default nextConfig;
