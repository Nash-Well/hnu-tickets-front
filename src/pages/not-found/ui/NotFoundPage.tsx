import { paths } from '@/shared/routes'
import { StatusPage } from '@/shared/ui'

export function NotFoundPage() {
  return (
    <StatusPage
      code="404"
      title="Сторінку не знайдено"
      description="Можливо, сторінку було переміщено або ви перейшли за некоректним посиланням."
      actionLabel="На головну"
      actionTo={paths.dashboard}
    />
  )
}
