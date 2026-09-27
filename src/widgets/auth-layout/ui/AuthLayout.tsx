import type { ReactNode } from 'react'
import { Box, Group, List, Paper, Stack, Text, ThemeIcon, Title } from '@mantine/core'
import { IconChartBar, IconCheck, IconHistory, IconUsersGroup } from '@tabler/icons-react'
import { ColorSchemeToggle, Logo } from '@/shared/ui'
import classes from './AuthLayout.module.css'

type AuthLayoutProps = {
  title: string
  subtitle: ReactNode
  children: ReactNode
  footer?: ReactNode
}

const highlights = [
  { icon: IconCheck, text: 'Реєстрація та відстеження заявок в одному місці' },
  { icon: IconUsersGroup, text: 'Розподіл задач між спеціалістами підтримки' },
  { icon: IconHistory, text: 'Повна історія змін і коментарі до кожної заявки' },
  { icon: IconChartBar, text: 'Аналітика ефективності служби підтримки' },
]

export function AuthLayout({ title, subtitle, children, footer }: AuthLayoutProps) {
  return (
    <div className={classes.wrapper}>
      <Box className={classes.aside} visibleFrom="md">
        <Stack gap="xl" maw={440}>
          <Title order={1} c="white" fz={34} lh={1.2}>
            Інформаційна система управління заявками технічної підтримки
          </Title>
          <List spacing="md" center>
            {highlights.map(({ icon: Icon, text }) => (
              <List.Item
                key={text}
                icon={
                  <ThemeIcon color="white" variant="light" size={30} radius="xl">
                    <Icon size={16} />
                  </ThemeIcon>
                }
              >
                <Text c="white" opacity={0.92}>
                  {text}
                </Text>
              </List.Item>
            ))}
          </List>
        </Stack>
      </Box>
      <main className={classes.main}>
        <Group justify="space-between" w="100%" maw={420} mb="xl">
          <Logo />
          <ColorSchemeToggle />
        </Group>
        <Paper withBorder radius="lg" p={{ base: 'lg', sm: 'xl' }} w="100%" maw={420} shadow="sm">
          <Title order={2} fz={24} mb={4}>
            {title}
          </Title>
          <Text c="dimmed" size="sm" mb="lg">
            {subtitle}
          </Text>
          {children}
        </Paper>
        {footer && (
          <Box mt="lg" maw={420} w="100%">
            {footer}
          </Box>
        )}
      </main>
    </div>
  )
}
