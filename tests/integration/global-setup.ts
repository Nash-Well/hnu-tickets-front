import type { TestProject } from 'vitest/node'

export default async function setup(project: TestProject) {
  const apiBaseUrl = String(project.config.env.VITE_API_BASE_URL)
  const health = new URL('/health', apiBaseUrl)
  const response = await fetch(health).catch(() => null)
  if (!response?.ok) {
    throw new Error(
      `The API is not reachable at ${health}. Start the backend and load the demo data (see README), ` +
        'or point VITE_API_BASE_URL at a running server.',
    )
  }
}
