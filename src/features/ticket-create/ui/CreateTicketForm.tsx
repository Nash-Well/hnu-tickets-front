import { Alert, Stack } from '@mantine/core'
import { schemaResolver, useForm } from '@mantine/form'
import { useMutation } from '@tanstack/react-query'
import { useCategoryOptions } from '@/entities/category'
import {
  type Ticket,
  ticketApi,
  ticketErrorFields,
  TicketFormFields,
  ticketFormSchema,
  type TicketFormValues,
  useSyncTicket,
} from '@/entities/ticket'
import { getErrorMessage } from '@/shared/api'
import { toneColor } from '@/shared/config'
import { applyApiErrorToForm, notifySuccess } from '@/shared/lib'
import { FormErrorAlert, ModalActions } from '@/shared/ui'

type CreateTicketFormProps = {
  onCreated: (ticket: Ticket) => void
  onCancel: () => void
}

export function CreateTicketForm({ onCreated, onCancel }: CreateTicketFormProps) {
  const categories = useCategoryOptions()
  const syncTicket = useSyncTicket()
  const form = useForm<TicketFormValues>({
    initialValues: { title: '', description: '', categoryId: '', priority: 'MEDIUM' },
    validate: schemaResolver(ticketFormSchema, { sync: true }),
    validateInputOnBlur: true,
  })

  const createTicket = useMutation({
    mutationFn: ticketApi.create,
    onSuccess: async (ticket) => {
      await syncTicket(ticket)
      notifySuccess('Заявку зареєстровано зі статусом «Нова».', 'Заявку створено')
      onCreated(ticket)
    },
    onError: (error) => applyApiErrorToForm(form, error, ticketErrorFields),
  })

  const handleSubmit = (values: TicketFormValues) =>
    createTicket.mutate({ ...values, title: values.title.trim(), description: values.description.trim() })

  return (
    <form onSubmit={form.onSubmit(handleSubmit)} noValidate>
      <Stack gap="md">
        <FormErrorAlert error={createTicket.error} visible={!Object.keys(form.errors).length} />
        {categories.isError && (
          <Alert color={toneColor.warning} variant="light" py="xs">
            Не вдалося завантажити категорії. {getErrorMessage(categories.error)}
          </Alert>
        )}
        <TicketFormFields form={form} categoryOptions={categories.options} categoriesLoading={categories.isLoading} />
        <ModalActions onCancel={onCancel} submitLabel="Створити заявку" pending={createTicket.isPending} />
      </Stack>
    </form>
  )
}
