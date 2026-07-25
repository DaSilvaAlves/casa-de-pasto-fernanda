import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  eslint: {
    // O type-checking do TypeScript corre na mesma no build.
    // Config de ESLint (flat config + eslint-config-next) a adicionar numa fase posterior.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
