import { fileURLToPath } from 'node:url'
import { dirname } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    dangerouslyAllowSVG: true,
    remotePatterns: [{ hostname: "images.pexels.com" }],
  },
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
