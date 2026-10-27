import { beforeAll, describe, expect, it } from 'vitest'
import { analyticsApi } from '@/entities/analytics/api/analytics-api'
import { ticketApi } from '@/entities/ticket/api/ticket-api'
import { tokenStorage } from '@/shared/api'
import { type Actors, createTicket, register, signInDemoAccounts } from './support'

const EXTRA_TICKETS = 300
const VIRTUAL_USERS = 10
const ITERATIONS = 20
const LIMIT_MS = 2000

let actors: Actors

function percentile(values: number[], p: number) {
  const sorted = [...values].sort((a, b) => a - b)
  return sorted[Math.min(sorted.length - 1, Math.ceil((p / 100) * sorted.length) - 1)]
}

async function timed(samples: number[], call: () => Promise<unknown>) {
  const start = performance.now()
  await call()
  samples.push(performance.now() - start)
}

function describeSamples(name: string, samples: number[]) {
  const format = (value: number) => value.toFixed(1).padStart(7)
  return `${name.padEnd(24)} n=${String(samples.length).padStart(3)} p50=${format(percentile(samples, 50))} ms p95=${format(
    percentile(samples, 95),
  )} ms max=${format(Math.max(...samples))} ms`
}

beforeAll(async () => {
  actors = await signInDemoAccounts()
  const reporter = await register('Load Reporter')
  for (let index = 0; index < EXTRA_TICKETS; index += 1) {
    await createTicket(reporter, { title: `Load test ticket ${index + 1}` })
  }
}, 120_000)

describe('response time', () => {
  it(`stays under ${LIMIT_MS} ms for ${VIRTUAL_USERS} concurrent clients`, async () => {
    tokenStorage.set(actors.admin.token)
    const { items, total } = await ticketApi.list({ pageSize: 20 })
    const samples = { list: [] as number[], details: [] as number[], overview: [] as number[], listAll: [] as number[] }

    await Promise.all(
      Array.from({ length: VIRTUAL_USERS }, async (_, user) => {
        for (let iteration = 0; iteration < ITERATIONS; iteration += 1) {
          await timed(samples.list, () => ticketApi.list({ page: (iteration % 5) + 1, pageSize: 20 }))
          await timed(samples.details, () => ticketApi.get(items[(user + iteration) % items.length].id))
          await timed(samples.overview, () => analyticsApi.overview({}))
        }
      }),
    )
    for (let run = 0; run < 5; run += 1) {
      await timed(samples.listAll, () => ticketApi.listAll({ sort: 'createdAt', order: 'asc' }))
    }

    console.info(
      [
        `tickets in the database: ${total}`,
        describeSamples('GET /tickets (page)', samples.list),
        describeSamples('GET /tickets/{id}', samples.details),
        describeSamples('GET /analytics/overview', samples.overview),
        describeSamples('listAll (all pages)', samples.listAll),
      ].join('\n'),
    )
    for (const values of Object.values(samples)) {
      expect(Math.max(...values)).toBeLessThan(LIMIT_MS)
    }
  })
})
