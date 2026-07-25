import { dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingRoot: __dirname,
  eslint: {
    // O type-checking do TypeScript corre na mesma no build.
    // Config de ESLint (flat config + eslint-config-next) a adicionar numa fase posterior.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
