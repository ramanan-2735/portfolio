const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // inline the (small) stylesheet so first paint doesn't wait on a CSS request
  experimental: { inlineCss: true },
};
export default nextConfig;
