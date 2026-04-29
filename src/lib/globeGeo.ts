import worldAtlas from 'world-atlas/countries-110m.json'
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from 'geojson'
import { feature } from 'topojson-client'

const boundaryIdByCountryId: Record<string, string> = {
  us: '840',
  uk: '826',
  de: '276',
  su: '643',
  fr: '250',
  it: '380',
  jp: '392',
  cn: '156',
}

type FeatureGeometry = Polygon | MultiPolygon
export type CountryFeature = Feature<FeatureGeometry, { name?: string }>

const worldFeatures = (feature(
  worldAtlas as any,
  (worldAtlas as any).objects.countries,
) as unknown as FeatureCollection<FeatureGeometry, { name?: string }>).features

export function getWorldCountryFeatures() {
  return worldFeatures
}

export function getFeatureForCountry(countryId: string) {
  const featureId = boundaryIdByCountryId[countryId]
  return worldFeatures.find((item: CountryFeature) => String(item.id) === featureId) ?? null
}

function projectToTexture([lng, lat]: [number, number], width: number, height: number) {
  const x = ((lng + 180) / 360) * width
  const y = ((90 - lat) / 180) * height
  return [x, y] as const
}

function drawRing(context: CanvasRenderingContext2D, ring: number[][], width: number, height: number) {
  ring.forEach((position, index) => {
    const [x, y] = projectToTexture([position[0], position[1]], width, height)
    if (index === 0) {
      context.moveTo(x, y)
      return
    }

    context.lineTo(x, y)
  })
}

function drawFeature(context: CanvasRenderingContext2D, geometry: FeatureGeometry, width: number, height: number) {
  if (geometry.type === 'Polygon') {
    geometry.coordinates.forEach((ring: number[][]) => drawRing(context, ring, width, height))
    return
  }

  geometry.coordinates.forEach((polygon: number[][][]) => {
    polygon.forEach((ring: number[][]) => drawRing(context, ring, width, height))
  })
}

function pseudoNoise(x: number, y: number) {
  const value = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453
  return value - Math.floor(value)
}

function drawGraticule(context: CanvasRenderingContext2D, width: number, height: number) {
  context.save()
  context.strokeStyle = 'rgba(231, 215, 184, 0.045)'
  context.lineWidth = 1

  for (let lng = -180; lng <= 180; lng += 15) {
    const [x] = projectToTexture([lng, 0], width, height)
    context.beginPath()
    context.moveTo(x, 0)
    context.lineTo(x, height)
    context.stroke()
  }

  for (let lat = -75; lat <= 75; lat += 15) {
    const [, y] = projectToTexture([0, lat], width, height)
    context.beginPath()
    context.moveTo(0, y)
    context.lineTo(width, y)
    context.stroke()
  }

  context.strokeStyle = 'rgba(231, 215, 184, 0.08)'
  context.lineWidth = 1.4
  context.beginPath()
  context.moveTo(0, height / 2)
  context.lineTo(width, height / 2)
  context.stroke()
  context.restore()
}

function drawDeterministicGrain(context: CanvasRenderingContext2D, width: number, height: number) {
  const imageData = context.getImageData(0, 0, width, height)
  const data = imageData.data

  for (let index = 0; index < data.length; index += 4) {
    const pixel = index / 4
    const x = pixel % width
    const y = Math.floor(pixel / width)
    const noise = pseudoNoise(x, y) - 0.5
    const amount = noise * 11

    data[index] = Math.max(0, Math.min(255, data[index] + amount))
    data[index + 1] = Math.max(0, Math.min(255, data[index + 1] + amount))
    data[index + 2] = Math.max(0, Math.min(255, data[index + 2] + amount))
  }

  context.putImageData(imageData, 0, 0)
}

function drawFixedGlow(
  context: CanvasRenderingContext2D,
  width: number,
  height: number,
  lng: number,
  lat: number,
  radius: number,
  color: string,
) {
  const [x, y] = projectToTexture([lng, lat], width, height)
  const glow = context.createRadialGradient(x, y, 0, x, y, radius)
  glow.addColorStop(0, color)
  glow.addColorStop(1, 'rgba(255, 255, 255, 0)')
  context.fillStyle = glow
  context.beginPath()
  context.arc(x, y, radius, 0, Math.PI * 2)
  context.fill()
}

export function createEarthTexture() {
  const width = 2048
  const height = 1024
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const context = canvas.getContext('2d')

  if (!context) {
    return ''
  }

  const ocean = context.createLinearGradient(0, 0, width, height)
  ocean.addColorStop(0, '#243948')
  ocean.addColorStop(0.32, '#102938')
  ocean.addColorStop(0.68, '#0b1b27')
  ocean.addColorStop(1, '#050d14')
  context.fillStyle = ocean
  context.fillRect(0, 0, width, height)

  drawGraticule(context, width, height)

  const land = context.createLinearGradient(0, 0, width, height)
  land.addColorStop(0, 'rgba(235, 219, 184, 0.34)')
  land.addColorStop(0.52, 'rgba(201, 176, 133, 0.25)')
  land.addColorStop(1, 'rgba(149, 122, 82, 0.24)')

  for (const item of worldFeatures) {
    if (item.properties?.name === 'Antarctica') {
      continue
    }

    context.beginPath()
    drawFeature(context, item.geometry, width, height)
    context.closePath()
    context.fillStyle = land
    context.fill()

    context.strokeStyle = 'rgba(255, 242, 214, 0.18)'
    context.lineWidth = 1.05
    context.stroke()

    context.strokeStyle = 'rgba(48, 36, 24, 0.18)'
    context.lineWidth = 2.8
    context.stroke()
  }

  drawFixedGlow(context, width, height, -75, 40, 210, 'rgba(212, 162, 75, 0.1)')
  drawFixedGlow(context, width, height, 15, 50, 240, 'rgba(232, 196, 142, 0.12)')
  drawFixedGlow(context, width, height, 116, 33, 210, 'rgba(214, 107, 81, 0.1)')
  drawFixedGlow(context, width, height, 139, 36, 150, 'rgba(115, 168, 215, 0.1)')

  drawDeterministicGrain(context, width, height)

  const vignette = context.createRadialGradient(width / 2, height / 2, height * 0.12, width / 2, height / 2, width * 0.72)
  vignette.addColorStop(0, 'rgba(255, 255, 255, 0.02)')
  vignette.addColorStop(0.68, 'rgba(255, 255, 255, 0)')
  vignette.addColorStop(1, 'rgba(0, 0, 0, 0.22)')
  context.fillStyle = vignette
  context.fillRect(0, 0, width, height)

  return canvas.toDataURL('image/png')
}
