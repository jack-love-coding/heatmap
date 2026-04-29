import { expect, test } from '@playwright/test'

test('story chapters and event syncing work', async ({ page }) => {
  await page.goto('/')

  await expect(page.getByText('战争如何改变音乐地图')).toBeVisible()
  await page.getByRole('button', { name: '转折与交流 1944-1945' }).click()
  await expect(page.getByText('巴黎解放')).toBeVisible()
  await expect(page.getByText('1944')).toBeVisible()

  await page.getByTitle('中华人民共和国成立').click()
  await expect(page.getByText('中华人民共和国成立')).toBeVisible()
  await expect(page.getByText('1949')).toBeVisible()
})

test('explore mode supports two-country comparison', async ({ page }) => {
  await page.goto('/')

  await page.getByTestId('mode-explore').click()
  await page.getByRole('button', { name: '德国' }).click()
  await page.getByRole('button', { name: '日本' }).click()

  const comparePanel = page.getByTestId('compare-panel')
  await expect(comparePanel).toContainText('德国')
  await expect(comparePanel).toContainText('日本')
})

test('mobile layout keeps key panels visible', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')

  await expect(page.getByTestId('atlas-controls')).toBeVisible()
  await expect(page.getByTestId('atlas-timeline')).toBeVisible()
  await expect(page.getByTestId('detail-panel')).toBeVisible()
})
