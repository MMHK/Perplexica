const IS_OUTPUT = process.env.OUTPUT || undefined;

/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: false,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        hostname: 's2.googleusercontent.com',
      },
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/api/:path*`, // 所有 /api/* 请求将被代理到 /api/proxy
      },
      {
        source: '/ws',
        destination: `${process.env.NEXT_PUBLIC_API_URL}/ws`, // 所有 /api/* 请求将被代理到 /api/proxy
      },
    ];
  },
  output: IS_OUTPUT ? "standalone": undefined,
};

export default nextConfig;
