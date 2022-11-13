/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env  : {
      baseApiUrl : process.env.baseApiUrl
  }
}

module.exports = nextConfig
