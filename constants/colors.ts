export const Colors = {
  // Brand — warmer, less electric violet
  violet: '#7655F0',
  violetLight: '#9B80F5',
  violetDark: '#5B3DD8',

  // Blue kept as secondary/utility colour only
  blue: '#2563EB',
  blueLight: '#3B82F6',

  navy: '#111827',
  navyMid: '#1F2937',

  // Background: barely-warm instead of cold blue tint
  background: '#FAF8FF',
  backgroundDark: '#EEE8FF',

  white: '#FFFFFF',
  border: '#E5E7EB',
  borderLight: '#F3F4F6',
  muted: '#6B7280',
  mutedLight: '#9CA3AF',
  success: '#22C55E',
  successLight: '#86EFAC',
  error: '#EF4444',
  warning: '#F59E0B',

  // Gradient pairs
  // Primary: violet → warm lavender (social warmth, not SaaS productivity)
  gradientViolet: ['#7655F0', '#C084FC'] as const,
  gradientCoral: ['#F4845F', '#E879A0'] as const,   // softened ~15% sat
  gradientMint: ['#2DBD8C', '#22B5CC'] as const,    // slightly muted
  gradientSunset: ['#E8A028', '#E86060'] as const,  // amber → soft red
  gradientLavender: ['#9171F0', '#818CF8'] as const,
  gradientOcean: ['#38B5D8', '#3B82F6'] as const,
  gradientForest: ['#34C472', '#20A44A'] as const,

  // Avatar gradients — all softened so they support content, not fight it
  avatarGradients: [
    ['#7655F0', '#9B80F5'],   // violet → soft lavender
    ['#F4845F', '#E879A0'],   // coral → soft rose
    ['#2DBD8C', '#22B5CC'],   // teal → cyan
    ['#E8A028', '#E86060'],   // amber → soft red
    ['#9171F0', '#818CF8'],   // lavender → periwinkle
    ['#38B5D8', '#3B82F6'],   // sky → blue
    ['#34C472', '#20A44A'],   // green
    ['#E879A0', '#9171F0'],   // rose → lavender
  ] as string[][],
};
