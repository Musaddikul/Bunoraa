module.exports = {
  plugins: {
    'postcss-import': {},
    'tailwindcss/nesting': {},
    tailwindcss: {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': false,
        'custom-media-queries': true,
        'media-query-ranges': true,
        'custom-selectors': true,
      },
      autoprefixer: {
        flexbox: 'no-2009',
        grid: 'autoplace',
      },
      browsers: 'last 4 versions',
    },
    'postcss-flexbugs-fixes': {},
    'postcss-reporter': {
      clearReportedMessages: true,
    },
    'postcss-normalize': {},
    cssnano: process.env.NODE_ENV === 'production' ? {
      preset: ['default', {
        discardComments: {
          removeAll: true,
        },
        normalizeWhitespace: true,
      }],
    } : false,
  },
}