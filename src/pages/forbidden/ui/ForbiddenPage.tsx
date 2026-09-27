import { paths } from '@/shared/routes'
import { StatusPage } from '@/shared/ui'

export function ForbiddenPage() {
  return (
    <StatusPage
      code="403"
      title="Доступ заборонено"
      description="Ваша роль не дозволяє переглядати цю сторінку. Якщо вважаєте це помилкою, зверніться до адміністратора."
      actionLabel="На головну"
      actionTo={paths.dashboard}
    />
  )
}
