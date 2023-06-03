const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    unoptimized:true,
  },
  compress:true,
  reactStrictMode: true,
  swcMinify:false,
};

module.exports = (withContentlayer(nextConfig));
