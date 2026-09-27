import { Group, SegmentedControl } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons-react'
import { PERIOD_PRESETS, presetToRange, type useAnalyticsPeriod } from '../model/use-analytics-period'

type PeriodPickerProps = {
  state: ReturnType<typeof useAnalyticsPeriod>
}

export function PeriodPicker({ state }: PeriodPickerProps) {
  const { range, activePreset, setRange } = state
  return (
    <Group gap="sm" wrap="wrap">
      <SegmentedControl
        data={PERIOD_PRESETS.map((preset) => ({ ...preset }))}
        value={activePreset ?? ''}
        onChange={(value) => setRange(presetToRange(value))}
        aria-label="Швидкий вибір періоду"
      />
      <DatePickerInput
        type="range"
        aria-label="Довільний період"
        placeholder="Довільний період"
        leftSection={<IconCalendar size={16} />}
        value={[range.from, range.to]}
        onChange={([from, to]) => {
          if (from && to) {
            setRange({ from, to })
          }
        }}
        valueFormat="DD.MM.YYYY"
        allowSingleDateInRange
        maxDate={new Date()}
        miw={230}
      />
    </Group>
  )
}
