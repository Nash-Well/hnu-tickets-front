import { Alert, Button, Group, Modal, Stack, Textarea, TextInput } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { IconAlertCircle } from '@tabler/icons-react'
import type { Category } from '@/entities/category'
import { getErrorMessage } from '@/shared/api'
import { applyApiErrorToForm } from '@/shared/lib'
import { categoryErrorFields, categorySchema, type CategoryValues } from '../model/schema'
import { useSaveCategory } from '../model/use-category-mutations'

type CategoryFormModalProps = {
  opened: boolean
  category?: Category | null
  onClose: () => void
}

function CategoryForm({ category, onClose }: { category?: Category | null; onClose: () => void }) {
  const saveCategory = useSaveCategory(category?.id)
  const form = useForm<CategoryValues>({
    mode: 'uncontrolled',
    initialValues: { name: category?.name ?? '', description: category?.description ?? '' },
    validate: schemaResolver(categorySchema, { sync: true }),
    validateInputOnBlur: true,
  })

  const handleSubmit = (values: CategoryValues) =>
    saveCategory.mutate(
      { name: values.name.trim(), description: values.description.trim() },
      {
        onSuccess: onClose,
        onError: (error) => applyApiErrorToForm(form, error, categoryErrorFields),
      },
    )

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack gap="md">
        {saveCategory.isError && !form.errors.name && (
          <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />} role="alert">
            {getErrorMessage(saveCategory.error)}
          </Alert>
        )}
        <TextInput
          label="Назва"
          placeholder="Наприклад, «Мережа та Інтернет»"
          required
          data-autofocus
          key={form.key('name')}
          {...form.getInputProps('name')}
        />
        <Textarea
          label="Опис"
          placeholder="Які проблеми належать до цієї категорії"
          autosize
          minRows={3}
          maxRows={8}
          key={form.key('description')}
          {...form.getInputProps('description')}
        />
        <Group justify="flex-end">
          <Button variant="default" onClick={onClose} disabled={saveCategory.isPending}>
            Скасувати
          </Button>
          <Button type="submit" loading={saveCategory.isPending}>
            {category ? 'Зберегти' : 'Створити'}
          </Button>
        </Group>
      </Stack>
    </form>
  )
}

export function CategoryFormModal({ opened, category, onClose }: CategoryFormModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={category ? 'Редагування категорії' : 'Нова категорія'} centered>
      {opened && <CategoryForm category={category} onClose={onClose} />}
    </Modal>
  )
}
