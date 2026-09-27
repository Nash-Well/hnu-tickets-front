import { useState } from 'react'
import { ActionIcon, Button, Group, Table, Text, Tooltip, VisuallyHidden } from '@mantine/core'
import { IconPencil, IconPlus, IconTrash } from '@tabler/icons-react'
import { type Category, useCategories } from '@/entities/category'
import { toneColor } from '@/shared/config'
import { CategoryFormModal, useDeleteCategory } from '@/features/category-manage'
import { confirmAction, EmptyState, ErrorState, PageHeader, SectionCard, TableSkeletonRows } from '@/shared/ui'

type ModalState = { opened: false } | { opened: true; category: Category | null }

export function CategoriesPage() {
  const categories = useCategories()
  const deleteCategory = useDeleteCategory()
  const [modal, setModal] = useState<ModalState>({ opened: false })

  const requestDelete = (category: Category) =>
    confirmAction({
      title: 'Видалення категорії',
      message: `Видалити категорію «${category.name}»? Категорію, яка використовується в заявках, видалити неможливо.`,
      confirmLabel: 'Видалити',
      danger: true,
      onConfirm: () => deleteCategory.mutate({ id: category.id, name: category.name }),
    })

  const renderBody = () => {
    if (categories.isError) {
      return <ErrorState error={categories.error} onRetry={() => categories.refetch()} />
    }
    if (categories.isSuccess && categories.data.length === 0) {
      return (
        <EmptyState
          title="Категорій ще немає"
          description="Створіть категорії, щоб користувачі могли класифікувати свої заявки."
          action={
            <Button leftSection={<IconPlus size={16} />} onClick={() => setModal({ opened: true, category: null })}>
              Створити категорію
            </Button>
          }
        />
      )
    }
    return (
      <Table.ScrollContainer minWidth={520}>
        <Table highlightOnHover>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Назва</Table.Th>
              <Table.Th>Опис</Table.Th>
              <Table.Th w={100}>
                <VisuallyHidden>Дії</VisuallyHidden>
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {categories.isLoading
              ? TableSkeletonRows({ rows: 6, columns: 3 })
              : categories.data?.map((category) => (
                  <Table.Tr key={category.id}>
                    <Table.Td>
                      <Text size="sm" fw={500}>
                        {category.name}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Text size="sm" c={category.description ? undefined : 'dimmed'} lineClamp={2}>
                        {category.description || 'Без опису'}
                      </Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4} justify="flex-end" wrap="nowrap">
                        <Tooltip label="Редагувати" withArrow>
                          <ActionIcon
                            variant="subtle"
                            color="gray"
                            onClick={() => setModal({ opened: true, category })}
                            aria-label={`Редагувати ${category.name}`}
                          >
                            <IconPencil size={16} />
                          </ActionIcon>
                        </Tooltip>
                        <Tooltip label="Видалити" withArrow>
                          <ActionIcon
                            variant="subtle"
                            color={toneColor.danger}
                            onClick={() => requestDelete(category)}
                            loading={deleteCategory.isPending && deleteCategory.variables?.id === category.id}
                            aria-label={`Видалити ${category.name}`}
                          >
                            <IconTrash size={16} />
                          </ActionIcon>
                        </Tooltip>
                      </Group>
                    </Table.Td>
                  </Table.Tr>
                ))}
          </Table.Tbody>
        </Table>
      </Table.ScrollContainer>
    )
  }

  return (
    <>
      <PageHeader
        title="Категорії заявок"
        actions={
          <Button leftSection={<IconPlus size={16} />} onClick={() => setModal({ opened: true, category: null })}>
            Нова категорія
          </Button>
        }
      />
      <SectionCard flush>{renderBody()}</SectionCard>
      <CategoryFormModal
        opened={modal.opened}
        category={modal.opened ? modal.category : null}
        onClose={() => setModal({ opened: false })}
      />
    </>
  )
}
