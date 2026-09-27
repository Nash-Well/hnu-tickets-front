import { useState } from 'react'
import { Box, Button, CloseButton, Grid, Select, TextInput } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { useDebouncedCallback } from '@mantine/hooks'
import { IconCalendar, IconFilterOff, IconSearch } from '@tabler/icons-react'
import { useCategoryOptions } from '@/entities/category'
import { priorityOptions, statusOptions, type TicketPriority, type TicketStatus } from '@/entities/ticket'
import { useSpecialists } from '@/entities/user'
import type { useTicketListParams } from '../model/use-ticket-list-params'

type TicketFiltersBarProps = {
  params: ReturnType<typeof useTicketListParams>
  showSpecialistFilter: boolean
}

export function TicketFiltersBar({ params, showSpecialistFilter }: TicketFiltersBarProps) {
  const { filters, setFilter, setDateRange, resetFilters, activeFilterCount } = params
  const categories = useCategoryOptions()
  const specialists = useSpecialists(showSpecialistFilter)
  const [search, setSearch] = useState(filters.q)
  const [appliedQuery, setAppliedQuery] = useState(filters.q)
  const applySearch = useDebouncedCallback((value: string) => {
    setAppliedQuery(value)
    setFilter('q', value)
  }, 350)

  if (filters.q !== appliedQuery) {
    setAppliedQuery(filters.q)
    setSearch(filters.q)
  }

  const changeSearch = (value: string) => {
    setSearch(value)
    applySearch(value)
  }

  const specialistOptions = (specialists.data ?? []).map((user) => ({ value: user.id, label: user.name }))
  const span = showSpecialistFilter ? { base: 12, sm: 6, lg: 2 } : { base: 12, sm: 6, lg: 2.4 }

  return (
    <Box mb="md">
      <Grid gap="sm" align="flex-end">
        <Grid.Col span={{ base: 12, lg: showSpecialistFilter ? 4 : 4.8 }}>
          <TextInput
            label="Пошук"
            placeholder="Назва або повний ID заявки"
            leftSection={<IconSearch size={16} />}
            value={search}
            onChange={(event) => changeSearch(event.currentTarget.value)}
            rightSection={
              search ? <CloseButton size="sm" aria-label="Очистити пошук" onClick={() => changeSearch('')} /> : null
            }
          />
        </Grid.Col>
        <Grid.Col span={span}>
          <Select
            label="Статус"
            placeholder="Усі статуси"
            data={statusOptions}
            value={filters.status}
            onChange={(value) => setFilter('status', value as TicketStatus | null)}
            clearable
          />
        </Grid.Col>
        <Grid.Col span={span}>
          <Select
            label="Пріоритет"
            placeholder="Усі пріоритети"
            data={priorityOptions}
            value={filters.priority}
            onChange={(value) => setFilter('priority', value as TicketPriority | null)}
            clearable
          />
        </Grid.Col>
        <Grid.Col span={span}>
          <Select
            label="Категорія"
            placeholder="Усі категорії"
            data={categories.options}
            value={filters.categoryId}
            onChange={(value) => setFilter('categoryId', value)}
            searchable
            clearable
            nothingFoundMessage="Нічого не знайдено"
          />
        </Grid.Col>
        {showSpecialistFilter && (
          <Grid.Col span={span}>
            <Select
              label="Спеціаліст"
              placeholder="Усі спеціалісти"
              data={specialistOptions}
              value={filters.assignedTo}
              onChange={(value) => setFilter('assignedTo', value)}
              searchable
              clearable
              nothingFoundMessage="Нічого не знайдено"
            />
          </Grid.Col>
        )}
        <Grid.Col span={{ base: 12, sm: 8, lg: showSpecialistFilter ? 4 : 4.8 }}>
          <DatePickerInput
            type="range"
            label="Дата створення"
            placeholder="Будь-яка дата"
            leftSection={<IconCalendar size={16} />}
            value={[filters.createdFrom, filters.createdTo]}
            onChange={([from, to]) => {
              if ((from && to) || (!from && !to)) {
                setDateRange(from, to)
              }
            }}
            valueFormat="DD.MM.YYYY"
            clearable
            allowSingleDateInRange
            maxDate={new Date()}
          />
        </Grid.Col>
        {activeFilterCount > 0 && (
        <Grid.Col span={{ base: 12, sm: 4, lg: 'content' }}>
          <Button
            variant="subtle"
            leftSection={<IconFilterOff size={16} />}
            onClick={() => {
              applySearch.cancel()
              setSearch('')
              setAppliedQuery('')
              resetFilters()
            }}
            fullWidth
          >
            Скинути фільтри
          </Button>
        </Grid.Col>
        )}
      </Grid>
    </Box>
  )
}
