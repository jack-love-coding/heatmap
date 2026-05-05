import { expect, test } from '@playwright/test'

async function switchToEnglish(page: import('@playwright/test').Page) {
  await page.getByRole('button', { name: 'EN' }).click()
}

test('home foregrounds the globe story and key events', async ({ page }) => {
  await page.goto('/')
  await switchToEnglish(page)

  await expect(page.getByText('How War Rewired the Musical Map')).toBeVisible()
  await expect(page.getByTestId('home-story-panel')).toBeVisible()
  await expect(page.getByTestId('home-connection-chain')).toContainText('Development Process')
  await expect(page.locator('body')).not.toContainText('Evidence Chain')
  await expect(page.getByTestId('home-event-rail')).toContainText('Key Event Timeline')
  await expect(page.getByRole('link', { name: 'Events' })).toBeVisible()
})

test('home event rail opens process modal and links to synced event detail', async ({ page }) => {
  await page.goto('/')
  await switchToEnglish(page)

  await page.getByTestId('home-event-rail').getByRole('button', { name: /Mukden Incident/ }).click()

  await expect(page.getByTestId('evidence-modal')).toContainText('Mukden Incident')
  await page.getByTestId('evidence-modal').getByRole('button', { name: 'Open event page' }).first().click()
  await expect(page).toHaveURL(/\/events/)
  await expect(page.getByTestId('event-detail')).toContainText('Mukden Incident')
  await expect(page.getByTestId('event-detail')).toContainText('1931')
})

test('home opens chapter development process modal and syncs chapter changes', async ({ page }) => {
  await page.goto('/')
  await switchToEnglish(page)

  await expect(page.getByTestId('home-connection-chain')).toContainText('Historical trigger')
  await expect(page.getByTestId('open-evidence-modal')).toContainText('View development process')
  await page.getByTestId('open-evidence-modal').click()

  await expect(page.getByTestId('evidence-modal')).toContainText('Pre-war Cultural Tension')
  await expect(page.getByTestId('evidence-modal')).toContainText('sound order beginning to split')
  await expect(page.getByTestId('evidence-modal')).toContainText('Mukden Incident')

  await page.getByRole('button', { name: 'Close' }).click()
  await page.getByRole('button', { name: /Expansion and Propaganda/ }).click()
  await page.getByTestId('open-evidence-modal').click()

  await expect(page.getByTestId('evidence-modal')).toContainText('Expansion and Propaganda')
  await expect(page.getByTestId('evidence-modal')).toContainText('political expansion pushed music into propaganda and ceremony')
  await expect(page.getByTestId('evidence-modal')).toContainText('Rome-Berlin Axis')
})

test('events page links selected countries into the compare page', async ({ page }) => {
  await page.goto('/events?event=pearl-harbor&lang=en')

  await expect(page.getByTestId('event-detail')).toContainText('Pearl Harbor')
  await page.getByTestId('event-detail').getByRole('button', { name: 'United States' }).click()

  await expect(page).toHaveURL(/\/countries/)
  await expect(page.getByTestId('compare-panel')).toContainText('United States')
  await expect(page.getByTestId('compare-panel')).toContainText('Japan')
})

test('countries page supports two-country comparison and source handoff', async ({ page }) => {
  await page.goto('/countries?year=1941&countries=us,jp&lang=en')

  await expect(page.getByTestId('compare-panel')).toContainText('United States')
  await expect(page.getByTestId('compare-panel')).toContainText('Japan')

  await page.getByRole('button', { name: 'Open Sources' }).click()

  await expect(page).toHaveURL(/\/sources/)
  await expect(page.getByRole('heading', { name: 'Archive Trail' })).toBeVisible()
})

test('sources page exposes archive records and methodology', async ({ page }) => {
  await page.goto('/sources?event=marshall-broadcast&countries=uk,fr&year=1947&lang=en')

  await expect(page.getByTestId('sources-page')).toContainText('Marshall Aid')
  await expect(page.getByTestId('sources-page')).toContainText('Playable audio')
  await expect(page.getByTestId('bibliography-dialog').first()).toContainText('Methodology')
  await expect(page.getByTestId('sources-page')).toContainText('archive-record links rather than in-panel players')
})

test('mobile home no longer stacks every secondary panel in the first viewport', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await expect(page.getByTestId('home-story-panel')).toBeVisible()
  await expect(page.getByTestId('home-event-rail')).toBeVisible()
  await expect(page.getByTestId('home-connection-chain')).toBeVisible()
  await expect(page.getByTestId('home-artist-dock')).toBeVisible()
  await expect(page.getByTestId('detail-panel')).toHaveCount(0)
  await expect(page.getByTestId('background-player')).toHaveCount(0)

  const positions = await page.evaluate(() => {
    const heroBottom = document.querySelector('.home-hero')?.getBoundingClientRect().bottom ?? 0
    const storyBottom = document.querySelector('[data-testid="home-story-panel"]')?.getBoundingClientRect().bottom ?? 0
    const railTop = document.querySelector('[data-testid="home-event-rail"]')?.getBoundingClientRect().top ?? 0
    const connectionTop = document.querySelector('[data-testid="home-connection-chain"]')?.getBoundingClientRect().top ?? 0
    const artistTop = document.querySelector('[data-testid="home-artist-dock"]')?.getBoundingClientRect().top ?? 0

    return { artistTop, connectionTop, heroBottom, railTop, storyBottom }
  })

  expect(positions.railTop).toBeGreaterThanOrEqual(positions.storyBottom - 1)
  expect(positions.connectionTop).toBeGreaterThanOrEqual(positions.heroBottom - 1)
  expect(positions.artistTop).toBeGreaterThanOrEqual(positions.heroBottom - 1)
})
