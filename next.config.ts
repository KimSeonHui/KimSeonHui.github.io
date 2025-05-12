/** @typedef {import('next').NextConfig} NextConfig */

const nextConfig = {
  output: process.env.NODE_ENV === "production" ? "export" : undefined,
  // 배포 환경에서만 basePath 적용
  basePath:
    process.env.NODE_ENV === "production" ? "/KimSeonHui.github.io" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
