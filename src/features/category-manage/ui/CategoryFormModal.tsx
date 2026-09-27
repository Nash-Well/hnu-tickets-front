import { Modal, Stack, Textarea, TextInput } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import type { Category } from '@/entities/category'
import { applyApiErrorToForm } from '@/shared/lib'
import { FormErrorAlert, ModalActions } from '@/shared/ui'
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
        <FormErrorAlert error={saveCategory.error} visible={!form.errors.name} />
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
        <ModalActions onCancel={onClose} submitLabel={category ? 'Зберегти' : 'Створити'} pending={saveCategory.isPending} />
      </Stack>
    </form>
  )
}

export function CategoryFormModal({ opened, category, onClose }: CategoryFormModalProps) {
  return (
    <Modal opened={opened} onClose={onClose} title={category ? 'Редагування категорії' : 'Нова категорія'}>
      {opened && <CategoryForm category={category} onClose={onClose} />}
    </Modal>
  )
}
