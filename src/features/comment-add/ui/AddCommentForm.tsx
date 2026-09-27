import { Button, Group, Stack, Text, Textarea } from '@mantine/core'
import { useForm } from '@mantine/form'
import { getHotkeyHandler } from '@mantine/hooks'
import { IconSend } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { commentApi, commentKeys } from '@/entities/comment'
import { notifyError } from '@/shared/lib'

const MAX_LENGTH = 5000

export function AddCommentForm({ ticketId }: { ticketId: string }) {
  const queryClient = useQueryClient()
  const form = useForm({
    initialValues: { content: '' },
    validate: {
      content: (value) => {
        const text = value.trim()
        if (!text) {
          return 'Коментар не може бути порожнім'
        }
        return text.length > MAX_LENGTH ? `Не більше ${MAX_LENGTH} символів` : null
      },
    },
  })

  const addComment = useMutation({
    mutationFn: (content: string) => commentApi.create(ticketId, content),
    onSuccess: async () => {
      form.reset()
      await queryClient.invalidateQueries({ queryKey: commentKeys.byTicket(ticketId) })
    },
    onError: (error) => notifyError(error, 'Не вдалося додати коментар'),
  })

  const submit = form.onSubmit(({ content }) => addComment.mutate(content.trim()))
  const length = form.getValues().content.length

  return (
    <form onSubmit={submit} noValidate>
      <Stack gap="xs">
        <Textarea
          label="Новий коментар"
          placeholder="Напишіть повідомлення… (Ctrl + Enter — надіслати)"
          autosize
          minRows={3}
          maxRows={10}
          onKeyDown={getHotkeyHandler([['mod+Enter', () => submit()]])}
          {...form.getInputProps('content')}
        />
        <Group justify="space-between">
          <Text size="xs" c={length > MAX_LENGTH ? 'var(--app-tone-danger-fg)' : 'dimmed'}>
            {length} / {MAX_LENGTH}
          </Text>
          <Button type="submit" leftSection={<IconSend size={16} />} loading={addComment.isPending}>
            Надіслати
          </Button>
        </Group>
      </Stack>
    </form>
  )
}
