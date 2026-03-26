/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    // !! ADVERTENCIA !!
    // Permite que la producción se compile correctamente incluso si hay errores de TypeScript.
    ignoreBuildErrors: true,
  },
  eslint: {
    // Permite que la producción se compile incluso si hay advertencias de ESLint.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;