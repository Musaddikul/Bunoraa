/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './frontend/templates/**/*.html',
        './frontend/static/js/**/*.js',
        './backend/templates/**/*.html',
        './templates/**/*.html',
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Brand colors
                primary: {
                    50: '#fdf4f3',
                    100: '#fce7e4',
                    200: '#fbd3cd',
                    300: '#f7b3a9',
                    400: '#f08778',
                    500: '#e5604d',
                    600: '#d14430',
                    700: '#af3625',
                    800: '#913023',
                    900: '#792d23',
                    950: '#41140e',
                },
                secondary: {
                    50: '#f6f6f6',
                    100: '#e7e7e7',
                    200: '#d1d1d1',
                    300: '#b0b0b0',
                    400: '#888888',
                    500: '#6d6d6d',
                    600: '#5d5d5d',
                    700: '#4f4f4f',
                    800: '#454545',
                    900: '#3d3d3d',
                    950: '#262626',
                },
                accent: {
                    50: '#fff7ed',
                    100: '#ffedd5',
                    200: '#fed7aa',
                    300: '#fdba74',
                    400: '#fb923c',
                    500: '#f97316',
                    600: '#ea580c',
                    700: '#c2410c',
                    800: '#9a3412',
                    900: '#7c2d12',
                    950: '#431407',
                },
                success: {
                    50: '#f0fdf4',
                    100: '#dcfce7',
                    200: '#bbf7d0',
                    300: '#86efac',
                    400: '#4ade80',
                    500: '#22c55e',
                    600: '#16a34a',
                    700: '#15803d',
                    800: '#166534',
                    900: '#14532d',
                    950: '#052e16',
                },
                warning: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#f59e0b',
                    600: '#d97706',
                    700: '#b45309',
                    800: '#92400e',
                    900: '#78350f',
                    950: '#451a03',
                },
                error: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                    950: '#450a0a',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
                serif: ['Merriweather', 'Georgia', 'serif'],
                mono: ['JetBrains Mono', 'Menlo', 'monospace'],
            },
            fontSize: {
                '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
            },
            spacing: {
                '18': '4.5rem',
                '88': '22rem',
                '128': '32rem',
            },
            maxWidth: {
                '8xl': '88rem',
                '9xl': '96rem',
            },
            borderRadius: {
                '4xl': '2rem',
            },
            boxShadow: {
                'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
                'soft-lg': '0 10px 40px -10px rgba(0, 0, 0, 0.1), 0 2px 20px -10px rgba(0, 0, 0, 0.06)',
                'inner-soft': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.04)',
            },
            animation: {
                'fade-in': 'fadeIn 0.3s ease-out',
                'fade-out': 'fadeOut 0.3s ease-out',
                'slide-in-up': 'slideInUp 0.3s ease-out',
                'slide-in-down': 'slideInDown 0.3s ease-out',
                'slide-in-left': 'slideInLeft 0.3s ease-out',
                'slide-in-right': 'slideInRight 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'bounce-soft': 'bounceSoft 0.5s ease-out',
                'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeOut: {
                    '0%': { opacity: '1' },
                    '100%': { opacity: '0' },
                },
                slideInUp: {
                    '0%': { transform: 'translateY(20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInDown: {
                    '0%': { transform: 'translateY(-20px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                slideInLeft: {
                    '0%': { transform: 'translateX(-20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                slideInRight: {
                    '0%': { transform: 'translateX(20px)', opacity: '0' },
                    '100%': { transform: 'translateX(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                bounceSoft: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-5px)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            transitionTimingFunction: {
                'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            aspectRatio: {
                'product': '4 / 5',
                'hero': '21 / 9',
            },
            typography: (theme) => ({
                DEFAULT: {
                    css: {
                        color: theme('colors.secondary.800'),
                        a: {
                            color: theme('colors.primary.600'),
                            '&:hover': {
                                color: theme('colors.primary.700'),
                            },
                        },
                        h1: {
                            color: theme('colors.secondary.900'),
                        },
                        h2: {
                            color: theme('colors.secondary.900'),
                        },
                        h3: {
                            color: theme('colors.secondary.900'),
                        },
                        h4: {
                            color: theme('colors.secondary.900'),
                        },
                    },
                },
            }),
        },
    },
    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class',
        }),
        require('@tailwindcss/typography'),
        require('@tailwindcss/aspect-ratio'),
        // Custom plugin for utilities
        function({ addUtilities, addComponents, theme }) {
            // Text gradient
            addUtilities({
                '.text-gradient': {
                    'background-clip': 'text',
                    '-webkit-background-clip': 'text',
                    '-webkit-text-fill-color': 'transparent',
                },
                '.text-gradient-primary': {
                    'background-image': `linear-gradient(135deg, ${theme('colors.primary.500')}, ${theme('colors.accent.500')})`,
                },
            });
            
            // Scrollbar styles
            addUtilities({
                '.scrollbar-hide': {
                    '-ms-overflow-style': 'none',
                    'scrollbar-width': 'none',
                    '&::-webkit-scrollbar': {
                        display: 'none',
                    },
                },
                '.scrollbar-thin': {
                    'scrollbar-width': 'thin',
                    '&::-webkit-scrollbar': {
                        width: '6px',
                        height: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                        background: theme('colors.secondary.100'),
                        borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                        background: theme('colors.secondary.300'),
                        borderRadius: '3px',
                        '&:hover': {
                            background: theme('colors.secondary.400'),
                        },
                    },
                },
            });
            
            // Skeleton loading
            addComponents({
                '.skeleton': {
                    background: `linear-gradient(90deg, ${theme('colors.secondary.100')} 25%, ${theme('colors.secondary.200')} 50%, ${theme('colors.secondary.100')} 75%)`,
                    backgroundSize: '200% 100%',
                    animation: 'shimmer 2s linear infinite',
                    borderRadius: theme('borderRadius.md'),
                },
            });
            
            // Button components
            addComponents({
                '.btn': {
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: `${theme('spacing.2')} ${theme('spacing.4')}`,
                    fontSize: theme('fontSize.sm[0]'),
                    fontWeight: theme('fontWeight.medium'),
                    lineHeight: theme('lineHeight.tight'),
                    borderRadius: theme('borderRadius.lg'),
                    transitionProperty: 'all',
                    transitionDuration: '200ms',
                    cursor: 'pointer',
                    '&:disabled': {
                        opacity: '0.5',
                        cursor: 'not-allowed',
                    },
                },
                '.btn-primary': {
                    backgroundColor: theme('colors.primary.600'),
                    color: theme('colors.white'),
                    '&:hover:not(:disabled)': {
                        backgroundColor: theme('colors.primary.700'),
                    },
                    '&:focus': {
                        outline: 'none',
                        boxShadow: `0 0 0 3px ${theme('colors.primary.200')}`,
                    },
                },
                '.btn-secondary': {
                    backgroundColor: theme('colors.secondary.100'),
                    color: theme('colors.secondary.700'),
                    '&:hover:not(:disabled)': {
                        backgroundColor: theme('colors.secondary.200'),
                    },
                    '&:focus': {
                        outline: 'none',
                        boxShadow: `0 0 0 3px ${theme('colors.secondary.200')}`,
                    },
                },
                '.btn-outline': {
                    backgroundColor: 'transparent',
                    borderWidth: '1px',
                    borderColor: theme('colors.secondary.300'),
                    color: theme('colors.secondary.700'),
                    '&:hover:not(:disabled)': {
                        backgroundColor: theme('colors.secondary.50'),
                        borderColor: theme('colors.secondary.400'),
                    },
                },
                '.btn-ghost': {
                    backgroundColor: 'transparent',
                    color: theme('colors.secondary.600'),
                    '&:hover:not(:disabled)': {
                        backgroundColor: theme('colors.secondary.100'),
                    },
                },
                '.btn-lg': {
                    padding: `${theme('spacing.3')} ${theme('spacing.6')}`,
                    fontSize: theme('fontSize.base[0]'),
                },
                '.btn-sm': {
                    padding: `${theme('spacing.1')} ${theme('spacing.3')}`,
                    fontSize: theme('fontSize.xs[0]'),
                },
                '.btn-icon': {
                    padding: theme('spacing.2'),
                },
            });
            
            // Form input components
            addComponents({
                '.input': {
                    display: 'block',
                    width: '100%',
                    padding: `${theme('spacing.2')} ${theme('spacing.3')}`,
                    fontSize: theme('fontSize.sm[0]'),
                    lineHeight: theme('lineHeight.normal'),
                    color: theme('colors.secondary.900'),
                    backgroundColor: theme('colors.white'),
                    borderWidth: '1px',
                    borderColor: theme('colors.secondary.300'),
                    borderRadius: theme('borderRadius.lg'),
                    transitionProperty: 'border-color, box-shadow',
                    transitionDuration: '200ms',
                    '&::placeholder': {
                        color: theme('colors.secondary.400'),
                    },
                    '&:focus': {
                        outline: 'none',
                        borderColor: theme('colors.primary.500'),
                        boxShadow: `0 0 0 3px ${theme('colors.primary.100')}`,
                    },
                    '&:disabled': {
                        backgroundColor: theme('colors.secondary.50'),
                        cursor: 'not-allowed',
                    },
                },
                '.input-error': {
                    borderColor: theme('colors.error.500'),
                    '&:focus': {
                        borderColor: theme('colors.error.500'),
                        boxShadow: `0 0 0 3px ${theme('colors.error.100')}`,
                    },
                },
                '.label': {
                    display: 'block',
                    marginBottom: theme('spacing.1'),
                    fontSize: theme('fontSize.sm[0]'),
                    fontWeight: theme('fontWeight.medium'),
                    color: theme('colors.secondary.700'),
                },
                '.help-text': {
                    marginTop: theme('spacing.1'),
                    fontSize: theme('fontSize.xs[0]'),
                    color: theme('colors.secondary.500'),
                },
                '.error-text': {
                    marginTop: theme('spacing.1'),
                    fontSize: theme('fontSize.xs[0]'),
                    color: theme('colors.error.600'),
                },
            });
            
            // Card components
            addComponents({
                '.card': {
                    backgroundColor: theme('colors.white'),
                    borderRadius: theme('borderRadius.xl'),
                    boxShadow: theme('boxShadow.soft'),
                    overflow: 'hidden',
                },
                '.card-body': {
                    padding: theme('spacing.6'),
                },
                '.card-header': {
                    padding: `${theme('spacing.4')} ${theme('spacing.6')}`,
                    borderBottomWidth: '1px',
                    borderColor: theme('colors.secondary.100'),
                },
                '.card-footer': {
                    padding: `${theme('spacing.4')} ${theme('spacing.6')}`,
                    borderTopWidth: '1px',
                    borderColor: theme('colors.secondary.100'),
                    backgroundColor: theme('colors.secondary.50'),
                },
            });
            
            // Badge components
            addComponents({
                '.badge': {
                    display: 'inline-flex',
                    alignItems: 'center',
                    padding: `${theme('spacing.0.5')} ${theme('spacing.2')}`,
                    fontSize: theme('fontSize.xs[0]'),
                    fontWeight: theme('fontWeight.medium'),
                    borderRadius: theme('borderRadius.full'),
                },
                '.badge-primary': {
                    backgroundColor: theme('colors.primary.100'),
                    color: theme('colors.primary.700'),
                },
                '.badge-success': {
                    backgroundColor: theme('colors.success.100'),
                    color: theme('colors.success.700'),
                },
                '.badge-warning': {
                    backgroundColor: theme('colors.warning.100'),
                    color: theme('colors.warning.700'),
                },
                '.badge-error': {
                    backgroundColor: theme('colors.error.100'),
                    color: theme('colors.error.700'),
                },
            });
        },
    ],
};
