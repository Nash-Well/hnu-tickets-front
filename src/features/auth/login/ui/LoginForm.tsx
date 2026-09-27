import { Button, PasswordInput, Stack, TextInput } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { useMutation } from '@tanstack/react-query'
import { sessionApi, useStartSession } from '@/entities/session'
import { applyApiErrorToForm } from '@/shared/lib'
import { FormErrorAlert } from '@/shared/ui'
import { loginSchema, type LoginValues } from '../model/schema'

type LoginFormProps = {
  onSuccess: () => void
}

export function LoginForm({ onSuccess }: LoginFormProps) {
  const startSession = useStartSession()
  const form = useForm<LoginValues>({
    mode: 'uncontrolled',
    initialValues: { email: '', password: '' },
    validate: schemaResolver(loginSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  const login = useMutation({
    mutationFn: sessionApi.login,
    onSuccess: (session) => {
      startSession(session)
      onSuccess()
    },
    onError: (error) => {
      applyApiErrorToForm(form, error, { INVALID_EMAIL: 'email' })
    },
  })

  const showAlert = login.isError && !form.errors.email

  return (
    <form onSubmit={form.onSubmit((values) => login.mutate(values))} noValidate>
      <Stack gap="md">
        <FormErrorAlert error={login.error} visible={showAlert} />
        <TextInput
          label="Email"
          placeholder="name@example.com"
          type="email"
          autoComplete="email"
          required
          key={form.key('email')}
          {...form.getInputProps('email')}
        />
        <PasswordInput
          label="Пароль"
          placeholder="Ваш пароль"
          autoComplete="current-password"
          required
          key={form.key('password')}
          {...form.getInputProps('password')}
        />
        <Button type="submit" fullWidth loading={login.isPending} mt="xs">
          Увійти
        </Button>
      </Stack>
    </form>
  )
}
