import { Modal, Stack, TextInput } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { type User, userErrorFields } from '@/entities/user'
import { applyApiErrorToForm, notifyInfo } from '@/shared/lib'
import { FormErrorAlert, ModalActions } from '@/shared/ui'
import { editUserSchema, type EditUserValues } from '../model/schema'
import { useUpdateUser } from '../model/use-user-mutations'

function EditUserForm({ user, onClose }: { user: User; onClose: () => void }) {
  const updateUser = useUpdateUser(user.id)
  const form = useForm<EditUserValues>({
    mode: 'uncontrolled',
    initialValues: { name: user.name, email: user.email },
    validate: schemaResolver(editUserSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  const handleSubmit = (values: EditUserValues) => {
    const name = values.name.trim()
    const email = values.email.trim().toLowerCase()
    const payload = {
      ...(name !== user.name ? { name } : {}),
      ...(email !== user.email ? { email } : {}),
    }
    if (Object.keys(payload).length === 0) {
      notifyInfo('Змін не виявлено.')
      onClose()
      return
    }
    updateUser.mutate(payload, {
      onSuccess: onClose,
      onError: (error) => applyApiErrorToForm(form, error, userErrorFields),
    })
  }

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack gap="md">
        <FormErrorAlert error={updateUser.error} visible={!form.errors.name && !form.errors.email} />
        <TextInput label="Повне ім’я" required data-autofocus key={form.key('name')} {...form.getInputProps('name')} />
        <TextInput label="Email" type="email" required key={form.key('email')} {...form.getInputProps('email')} />
        <ModalActions onCancel={onClose} submitLabel="Зберегти" pending={updateUser.isPending} />
      </Stack>
    </form>
  )
}

type EditUserModalProps = {
  user: User | null
  onClose: () => void
}

export function EditUserModal({ user, onClose }: EditUserModalProps) {
  return (
    <Modal opened={Boolean(user)} onClose={onClose} title="Редагування користувача">
      {user && <EditUserForm user={user} onClose={onClose} />}
    </Modal>
  )
}
