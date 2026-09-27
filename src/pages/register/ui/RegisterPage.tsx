import { Anchor, Text } from '@mantine/core'
import { Link, useNavigate } from 'react-router'
import { RegisterForm } from '@/features/auth/register'
import { notifySuccess } from '@/shared/lib'
import { paths } from '@/shared/routes'
import { AuthLayout } from '@/widgets/auth-layout'

export function RegisterPage() {
  const navigate = useNavigate()
  return (
    <AuthLayout
      title="Реєстрація"
      subtitle="Створіть обліковий запис, щоб звертатися до служби технічної підтримки."
      footer={
        <Text size="sm" ta="center" c="dimmed">
          Вже маєте обліковий запис?{' '}
          <Anchor component={Link} to={paths.login} fw={600}>
            Увійти
          </Anchor>
        </Text>
      }
    >
      <RegisterForm
        onSuccess={() => {
          notifySuccess('Обліковий запис створено. Ласкаво просимо!')
          navigate(paths.dashboard, { replace: true })
        }}
      />
    </AuthLayout>
  )
}
