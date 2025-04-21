import nextra from 'nextra';

const withNextra = nextra({
  latex: true,
  defaultShowCopyCode: true,
  contentDirBasePath: '/docs',
});

const isProd = process.env.NODE_ENV === 'production';
const basePath = '/nestjs-turbo';

const nextConfig = {
  reactStrictMode: true,
  ...(isProd && {
    basePath,
    assetPrefix: basePath,
    trailingSlash: true
  }),
  output: 'export',
  images: {
    unoptimized: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withNextra(nextConfig);
