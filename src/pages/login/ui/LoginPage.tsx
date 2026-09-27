import { Anchor, Text } from '@mantine/core'
import { Link, useLocation, useNavigate } from 'react-router'
import { LoginForm } from '@/features/auth/login'
import { paths } from '@/shared/routes'
import { AuthLayout } from '@/widgets/auth-layout'

export function LoginPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const redirectTo = (location.state as { from?: string } | null)?.from ?? paths.dashboard

  return (
    <AuthLayout
      title="Вхід"
      footer={
        <Text size="sm" c="dimmed">
          Ще не маєте облікового запису?{' '}
          <Anchor component={Link} to={paths.register} state={location.state} fw={600}>
            Зареєструватися
          </Anchor>
        </Text>
      }
    >
      <LoginForm onSuccess={() => navigate(redirectTo, { replace: true })} />
    </AuthLayout>
  )
}
