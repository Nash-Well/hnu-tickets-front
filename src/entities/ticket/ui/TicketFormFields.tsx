import { Select, SimpleGrid, Stack, Text, Textarea, TextInput } from '@mantine/core'
import type { UseFormReturnType } from '@mantine/form'
import { priorityDescriptions } from '../model/labels'
import { priorityOptions } from '../model/options'
import type { TicketPriority } from '../model/types'
import type { TicketFormValues } from '../model/validation'

type TicketFormFieldsProps = {
  form: UseFormReturnType<TicketFormValues>
  categoryOptions: { value: string; label: string }[]
  categoriesLoading?: boolean
}

export function TicketFormFields({ form, categoryOptions, categoriesLoading = false }: TicketFormFieldsProps) {
  return (
    <Stack gap="md">
      <TextInput
        label="Назва"
        placeholder="Коротко опишіть проблему"
        required
        maxLength={255}
        key={form.key('title')}
        {...form.getInputProps('title')}
      />
      <Textarea
        label="Опис проблеми"
        placeholder="Що сталося, коли, які кроки вже виконано, повідомлення про помилки…"
        required
        autosize
        minRows={5}
        maxRows={14}
        key={form.key('description')}
        {...form.getInputProps('description')}
      />
      <SimpleGrid cols={{ base: 1, sm: 2 }}>
        <Select
          label="Категорія"
          placeholder={categoriesLoading ? 'Завантаження…' : 'Оберіть категорію'}
          data={categoryOptions}
          searchable
          required
          nothingFoundMessage="Категорій не знайдено"
          disabled={categoriesLoading}
          key={form.key('categoryId')}
          {...form.getInputProps('categoryId')}
        />
        <Select
          label="Пріоритет"
          data={priorityOptions}
          required
          allowDeselect={false}
          renderOption={({ option }) => (
            <Stack gap={0}>
              <Text size="sm" fw={500}>
                {option.label}
              </Text>
              <Text size="xs" c="dimmed">
                {priorityDescriptions[option.value as TicketPriority]}
              </Text>
            </Stack>
          )}
          description={priorityDescriptions[form.getValues().priority]}
          key={form.key('priority')}
          {...form.getInputProps('priority')}
        />
      </SimpleGrid>
    </Stack>
  )
}
