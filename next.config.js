const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output:'export',
  images:{
    unoptimized:false,
    imageSizes: [64, 384],
    deviceSizes: [768, 1920],
    domains: ['res.cloudinary.com'],
    minimumCacheTTL: 60 * 60 * 24 * 30,
  },
  reactStrictMode: false,
  swcMinify:true,
};

module.exports = (withContentlayer(nextConfig));
