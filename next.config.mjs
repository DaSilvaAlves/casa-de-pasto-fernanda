/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  basePath: "/casa-de-pasto-fernanda",
  images: {
    unoptimized: true,
  },
  eslint: {
    // O type-checking do TypeScript corre na mesma no build.
    // Config de ESLint (flat config + eslint-config-next) a adicionar numa fase posterior.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
