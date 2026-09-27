import { createTheme, rem } from '@mantine/core'
import { danger, petrol, positive, slate, slateDark, warning } from './palette'

const uiFont = "'Inter Variable', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif"
const displayFont = "'IBM Plex Sans Variable', 'IBM Plex Sans', " + uiFont

export const theme = createTheme({
  primaryColor: 'petrol',
  primaryShade: { light: 7, dark: 6 },
  colors: {
    petrol,
    gray: slate,
    dark: slateDark,
    positive,
    warning,
    danger,
  },
  white: '#ffffff',
  black: slate[9],
  fontFamily: uiFont,
  fontFamilyMonospace: "ui-monospace, 'SF Mono', 'JetBrains Mono', Menlo, Consolas, monospace",
  fontSizes: {
    xs: rem(12),
    sm: rem(13),
    md: rem(14),
    lg: rem(16),
    xl: rem(18),
  },
  lineHeights: {
    xs: '1.4',
    sm: '1.45',
    md: '1.5',
    lg: '1.5',
    xl: '1.4',
  },
  headings: {
    fontFamily: displayFont,
    fontWeight: '600',
    textWrap: 'balance',
    sizes: {
      h1: { fontSize: rem(26), lineHeight: '1.2', fontWeight: '600' },
      h2: { fontSize: rem(20), lineHeight: '1.25', fontWeight: '600' },
      h3: { fontSize: rem(16), lineHeight: '1.35', fontWeight: '600' },
      h4: { fontSize: rem(14), lineHeight: '1.4', fontWeight: '600' },
      h5: { fontSize: rem(13), lineHeight: '1.4', fontWeight: '600' },
      h6: { fontSize: rem(12), lineHeight: '1.4', fontWeight: '600' },
    },
  },
  spacing: {
    xs: rem(6),
    sm: rem(10),
    md: rem(16),
    lg: rem(24),
    xl: rem(32),
  },
  radius: {
    xs: rem(2),
    sm: rem(4),
    md: rem(6),
    lg: rem(8),
    xl: rem(12),
  },
  defaultRadius: 'sm',
  shadows: {
    xs: '0 1px 1px rgb(17 19 22 / 0.04)',
    sm: '0 1px 2px rgb(17 19 22 / 0.06)',
    md: '0 4px 12px rgb(17 19 22 / 0.08), 0 1px 2px rgb(17 19 22 / 0.06)',
    lg: '0 8px 24px rgb(17 19 22 / 0.12), 0 2px 4px rgb(17 19 22 / 0.06)',
    xl: '0 16px 40px rgb(17 19 22 / 0.16)',
  },
  cursorType: 'pointer',
  focusRing: 'auto',
  autoContrast: true,
  luminanceThreshold: 0.35,
  other: {
    displayFont,
  },
  components: {
    Button: { defaultProps: { radius: 'sm' } },
    Paper: { defaultProps: { radius: 'md', shadow: undefined } },
    Modal: { defaultProps: { radius: 'md', shadow: 'lg', overlayProps: { backgroundOpacity: 0.4 } } },
    Menu: { defaultProps: { shadow: 'md', radius: 'sm' } },
    Popover: { defaultProps: { shadow: 'md', radius: 'sm' } },
    Tooltip: { defaultProps: { openDelay: 300, radius: 'sm' } },
    Select: { defaultProps: { comboboxProps: { shadow: 'md', radius: 'sm' } } },
    Badge: { defaultProps: { radius: 'sm' } },
    Table: {
      defaultProps: { verticalSpacing: 'xs', horizontalSpacing: 'md' },
      classNames: { table: 'app-tabular' },
      styles: {
        table: { '--table-border-color': 'var(--app-border-subtle)' },
        th: {
          color: 'var(--app-text-muted)',
          fontSize: 'var(--mantine-font-size-xs)',
          fontWeight: 500,
          whiteSpace: 'nowrap',
        },
      },
    },
    NavLink: {
      styles: {
        root: { borderRadius: 'var(--mantine-radius-sm)' },
        label: { fontSize: 'var(--mantine-font-size-md)' },
      },
    },
    InputWrapper: {
      styles: {
        label: { fontWeight: 500, marginBottom: 4 },
      },
    },
    Tabs: {
      styles: {
        tab: { fontWeight: 500 },
      },
    },
    Notification: { defaultProps: { radius: 'sm' } },
  },
})
