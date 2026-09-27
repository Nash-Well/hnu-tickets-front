import { Avatar, type AvatarProps } from '@mantine/core'

type UserAvatarProps = Omit<AvatarProps, 'children' | 'name'> & {
  name: string
}

export function UserAvatar({ name, ...props }: UserAvatarProps) {
  return <Avatar name={name} color="initials" radius="xl" {...props} />
}
