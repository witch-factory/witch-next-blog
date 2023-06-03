
const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress:true,
  reactStrictMode: true,
  swcMinify:false,
  images:{
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'witch-next-blog.vercel.app',
      },
    ],
  }
};

module.exports = (withContentlayer(nextConfig));
