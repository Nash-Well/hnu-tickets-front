import { Alert, Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { IconAlertCircle, IconAt, IconLock, IconUser } from '@tabler/icons-react'
import { useMutation } from '@tanstack/react-query'
import { sessionApi, useStartSession } from '@/entities/session'
import { getErrorMessage } from '@/shared/api'
import { applyApiErrorToForm } from '@/shared/lib'
import { userErrorFields } from '@/entities/user'
import { registerSchema, type RegisterValues } from '../model/schema'

type RegisterFormProps = {
  onSuccess: () => void
}

export function RegisterForm({ onSuccess }: RegisterFormProps) {
  const startSession = useStartSession()
  const form = useForm<RegisterValues>({
    mode: 'uncontrolled',
    initialValues: { name: '', email: '', password: '', confirmPassword: '' },
    validate: schemaResolver(registerSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  const register = useMutation({
    mutationFn: sessionApi.register,
    onSuccess: (session) => {
      startSession(session)
      onSuccess()
    },
  })

  const handleSubmit = ({ name, email, password }: RegisterValues) => {
    register.mutate(
      { name: name.trim(), email: email.trim(), password },
      { onError: (error) => applyApiErrorToForm(form, error, userErrorFields) },
    )
  }

  const errorIsMappedToField = Object.values(userErrorFields).some((field) => form.errors[field])

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack gap="md">
        {register.isError && !errorIsMappedToField && (
          <Alert color="red" variant="light" icon={<IconAlertCircle size={18} />} role="alert">
            {getErrorMessage(register.error)}
          </Alert>
        )}
        <TextInput
          label="Повне ім’я"
          placeholder="Іван Петренко"
          autoComplete="name"
          leftSection={<IconUser size={16} />}
          required
          key={form.key('name')}
          {...form.getInputProps('name')}
        />
        <TextInput
          label="Email"
          placeholder="name@example.com"
          type="email"
          autoComplete="email"
          leftSection={<IconAt size={16} />}
          required
          key={form.key('email')}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Пароль"
          description="Щонайменше 8 символів"
          autoComplete="new-password"
          leftSection={<IconLock size={16} />}
          required
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
        <PasswordInput
          label="Підтвердження пароля"
          autoComplete="new-password"
          leftSection={<IconLock size={16} />}
          required
          key={form.key('confirmPassword')}
          {...form.getInputProps('confirmPassword')}
        />
        <Button type="submit" fullWidth loading={register.isPending} mt="xs">
          Створити обліковий запис
        </Button>
      </Stack>
    </form>
  )
}
