const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    unoptimized:true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'witch-next-blog.vercel.app',
      },
    ],
  },
  compress:true,
  reactStrictMode: true,
  swcMinify:false,
};

module.exports = (withContentlayer(nextConfig));
