/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add React strict mode to help with development
  reactStrictMode: true,
  // Configure compiler options to handle hydration issues better
  compiler: {
    // Stale-while-revalidate to help with hydration
    styledComponents: true,
  },
}

export default nextConfig
