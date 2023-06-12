const { withContentlayer } = require('next-contentlayer');

/** @type {import('next').NextConfig} */
const nextConfig = {
  images:{
    unoptimized:false,
    imageSizes: [64, 384],
    deviceSizes: [768, 1920],
    domains: ['res.cloudinary.com'],
  },
  reactStrictMode: false,
  swcMinify:true,
};

module.exports = (withContentlayer(nextConfig));
