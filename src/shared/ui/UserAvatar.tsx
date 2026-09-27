import { Avatar, type AvatarProps } from '@mantine/core'

type UserAvatarProps = Omit<AvatarProps, 'children' | 'name' | 'color'> & {
  name: string
}

export function UserAvatar({ name, ...props }: UserAvatarProps) {
  return <Avatar name={name} color="gray" variant="light" radius="xl" {...props} />
}
