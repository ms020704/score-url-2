/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    optimizePackageImports: false,
    optimizeCss: false, // lightningcss 완전 비활성화
  },
  compiler: {
    cssModuleOptions: {
      exportLocalsConvention: 'camelCase',
    },
  },
  // Turbopack 대신 Webpack 강제
  turbopack: false,
}

export default nextConfig
