import { ActionIcon, Tooltip, useComputedColorScheme, useMantineColorScheme } from '@mantine/core'
import { IconMoon, IconSun } from '@tabler/icons-react'

export function ColorSchemeToggle() {
  const { setColorScheme } = useMantineColorScheme()
  const computed = useComputedColorScheme('light', { getInitialValueInEffect: true })
  const nextScheme = computed === 'dark' ? 'light' : 'dark'
  const label = nextScheme === 'dark' ? 'Темна тема' : 'Світла тема'
  return (
    <Tooltip label={label} withArrow>
      <ActionIcon variant="default" size="lg" onClick={() => setColorScheme(nextScheme)} aria-label={label}>
        {computed === 'dark' ? <IconSun size={18} /> : <IconMoon size={18} />}
      </ActionIcon>
    </Tooltip>
  )
}
