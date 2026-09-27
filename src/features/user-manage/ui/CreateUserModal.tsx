import { Modal, PasswordInput, Select, Stack, TextInput } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { roleOptions, userErrorFields } from '@/entities/user'
import { applyApiErrorToForm } from '@/shared/lib'
import { FormErrorAlert, ModalActions } from '@/shared/ui'
import { createUserSchema, type CreateUserValues } from '../model/schema'
import { useCreateUser } from '../model/use-user-mutations'

function CreateUserForm({ onClose }: { onClose: () => void }) {
  const createUser = useCreateUser()
  const form = useForm<CreateUserValues>({
    mode: 'uncontrolled',
    initialValues: { name: '', email: '', password: '', role: 'USER' },
    validate: schemaResolver(createUserSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  const handleSubmit = (values: CreateUserValues) =>
    createUser.mutate(
      { ...values, name: values.name.trim(), email: values.email.trim() },
      {
        onSuccess: onClose,
        onError: (error) => applyApiErrorToForm(form, error, userErrorFields),
      },
    )

  const fieldHasError = ['name', 'email', 'password'].some((field) => form.errors[field])

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack gap="md">
        <FormErrorAlert error={createUser.error} visible={!fieldHasError} />
        <TextInput label="Повне ім’я" required data-autofocus key={form.key('name')} {...form.getInputProps('name')} />
        <TextInput label="Email" type="email" required key={form.key('email')} {...form.getInputProps('email')} />
        <PasswordInput
          label="Початковий пароль"
          description="Щонайменше 8 символів. Передайте його користувачу безпечним способом."
          autoComplete="new-password"
          required
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
        <Select
          label="Роль"
          data={roleOptions}
          allowDeselect={false}
          required
          key={form.key('role')}
          {...form.getInputProps('role')}
        />
        <ModalActions onCancel={onClose} submitLabel="Створити" pending={createUser.isPending} />
      </Stack>
    </form>
  )
}

export function CreateUserModal({ opened, onClose }: { opened: boolean; onClose: () => void }) {
  return (
    <Modal opened={opened} onClose={onClose} title="Новий користувач">
      {opened && <CreateUserForm onClose={onClose} />}
    </Modal>
  )
}
