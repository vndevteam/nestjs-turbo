import nextra from 'nextra';

const withNextra = nextra({
  latex: true,
  defaultShowCopyCode: true,
  contentDirBasePath: '/docs',
});

const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default withNextra(nextConfig);
