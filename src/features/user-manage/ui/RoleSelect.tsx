import { Select } from '@mantine/core'
import { roleLabels, roleOptions, type User, type UserRole } from '@/entities/user'
import { confirmAction } from '@/shared/ui'
import { useChangeUserRole } from '../model/use-user-mutations'

type RoleSelectProps = {
  user: User
  disabled?: boolean
}

export function RoleSelect({ user, disabled = false }: RoleSelectProps) {
  const changeRole = useChangeUserRole()

  const handleChange = (value: string | null) => {
    const role = value as UserRole | null
    if (!role || role === user.role) {
      return
    }
    confirmAction({
      title: 'Зміна ролі',
      message: `Змінити роль користувача «${user.name}» з «${roleLabels[user.role]}» на «${roleLabels[role]}»? Нова роль набуде чинності після повторного входу користувача.`,
      confirmLabel: 'Змінити роль',
      onConfirm: () => changeRole.mutate({ id: user.id, role, name: user.name }),
    })
  }

  return (
    <Select
      aria-label={`Роль користувача ${user.name}`}
      data={roleOptions}
      value={user.role}
      onChange={handleChange}
      allowDeselect={false}
      disabled={disabled || changeRole.isPending}
      size="xs"
      w={170}
    />
  )
}
