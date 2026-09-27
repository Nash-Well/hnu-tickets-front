import { ActionIcon, CopyButton, Group, Text, Tooltip } from '@mantine/core'
import { IconCheck, IconCopy } from '@tabler/icons-react'
import { shortId } from '@/shared/lib'

export function TicketId({ id, withCopy = false }: { id: string; withCopy?: boolean }) {
  return (
    <Group gap={4} wrap="nowrap">
      <Text ff="monospace" size="xs" c="dimmed" title={id}>
        #{shortId(id)}
      </Text>
      {withCopy && (
        <CopyButton value={id} timeout={1500}>
          {({ copied, copy }) => (
            <Tooltip label={copied ? 'Скопійовано' : 'Копіювати повний ідентифікатор'} withArrow>
              <ActionIcon
                variant="subtle"
                color="gray"
                size="sm"
                onClick={copy}
                aria-label="Копіювати ідентифікатор заявки"
              >
                {copied ? <IconCheck size={14} /> : <IconCopy size={14} />}
              </ActionIcon>
            </Tooltip>
          )}
        </CopyButton>
      )}
    </Group>
  )
}
