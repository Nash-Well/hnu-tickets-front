import { createTheme, type MantineColorsTuple } from '@mantine/core'

const brand: MantineColorsTuple = [
  '#edf2ff',
  '#dbe4ff',
  '#bac8ff',
  '#91a7ff',
  '#748ffc',
  '#5c7cfa',
  '#4c6ef5',
  '#4263eb',
  '#3b5bdb',
  '#364fc7',
]

export const theme = createTheme({
  primaryColor: 'brand',
  colors: { brand },
  primaryShade: { light: 6, dark: 5 },
  fontFamily: "'Inter Variable', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
  headings: {
    fontFamily: "'Inter Variable', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    fontWeight: '700',
  },
  defaultRadius: 'md',
  cursorType: 'pointer',
  focusRing: 'auto',
  components: {
    Button: { defaultProps: { radius: 'md' } },
    Paper: { defaultProps: { radius: 'md' } },
    Modal: { defaultProps: { radius: 'lg', overlayProps: { backgroundOpacity: 0.45, blur: 2 } } },
    Tooltip: { defaultProps: { openDelay: 200 } },
    Select: { defaultProps: { comboboxProps: { shadow: 'md' } } },
    Badge: { defaultProps: { fw: 600 } },
    Table: { defaultProps: { striped: false } },
  },
})
