
const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  compress:true,
  reactStrictMode: true,
  swcMinify:false,
  images: {
    domains: ['localhost', '']
  }
};

module.exports = (withContentlayer(nextConfig));
