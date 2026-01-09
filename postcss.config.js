const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = !isProduction;

// Minimal plugins for development, full pipeline for production
module.exports = {
  plugins: {
    // Always needed
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    
    // Only in production - autoprefixer handles browser compatibility
    ...(isProduction && {
      autoprefixer: {
        flexbox: 'no-2009',
        grid: 'autoplace',
      },
    }),
    
    // Only in production - minification
    ...(isProduction && {
      cssnano: {
        preset: ['default', {
          discardComments: { removeAll: true },
          normalizeWhitespace: true,
          // Skip expensive optimizations
          calc: false,
          colormin: false,
          convertValues: false,
          reduceTransforms: false,
        }],
      },
    }),
  },
}