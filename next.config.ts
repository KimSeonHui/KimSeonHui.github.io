/** @typedef {import('next').NextConfig} NextConfig */

const nextConfig = {
  output: "export",
  basePath:
    process.env.NODE_ENV === "production" ? "/KimSeonHui.github.io" : "",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
