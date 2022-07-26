
const isLocal = process.env.SS_ENV === 'local'

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    BASE_URL: isLocal ? 'http://localhost:8080' : 'https://shopswap-by-ray.vercel.app'
  }
}

module.exports = nextConfig
