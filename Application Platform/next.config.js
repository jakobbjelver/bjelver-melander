/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['images.ctfassets.net'],
  },
  webpack: (config, { webpack }) => {
    config.plugins.push(new webpack.IgnorePlugin({
        resourceRegExp: /^pg-native$|^cloudflare:sockets$/,
    }))
    config.resolve.fallback = {
      ...config.resolve.fallback,
      'webworker-threads': false,  // natural classifier parallel train
      aws4: false,                 // mongodb client dependency
    };
    return config
},
}

module.exports = nextConfig
