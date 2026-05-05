<script setup lang="ts">
import { computed, defineAsyncComponent, onBeforeUnmount, ref } from 'vue'
import { navigateTo } from '@/router'
import { useAtlasState } from '@/composables/useAtlasState'
import {
  getArtistRole,
  getArtistWorkNote,
  getChapterSummary,
  getChapterTitle,
  getCountryName,
  getEventDescription,
  getEventTitle,
  getFeaturedArtistsForContext,
  getChapterForYear,
} from '@/lib/atlas'
import type { ArtistMarker } from '@/data/atlasMarkers'
import type { ChapterEvidencePoint, ChapterScene, HistoricEvent, LayerKey, RelatedSong } from '@/data/ww2MusicAtlas'

const GlobeStage = defineAsyncComponent(() => import('@/components/GlobeStage.vue'))
const atlas = useAtlasState()
const showEvidenceModal = ref(false)
const processChapter = ref<ChapterScene | null>(null)
const processEventId = ref<string | null>(null)
const previewEventId = ref<string | null>(null)

let previewClearTimer: number | null = null

const layers: LayerKey[] = ['styles', 'events', 'influence']
const evidenceArtists = computed(() =>
  getFeaturedArtistsForContext({
    activeEvent: atlas.activeEvent.value,
    countryDetails: atlas.countryDetails.value,
    activeYear: atlas.activeYear.value,
    limit: 5,
  }),
)

const activeProcessChapter = computed(() => processChapter.value ?? atlas.activeChapter.value)
const processEvents = computed(() =>
  activeProcessChapter.value.focusEventIds
    .map((eventId) => atlas.historicEvents.find((event) => event.id === eventId))
    .filter((event): event is NonNullable<typeof event> => Boolean(event)),
)
const processEvent = computed(() => findEvent(processEventId.value))
const previewEvent = computed(() => findEvent(previewEventId.value))
const previewChapter = computed(() => (previewEvent.value ? getChapterForEvent(previewEvent.value.id) : null))
const activeChapterEventIds = computed(() => new Set(atlas.activeChapter.value.focusEventIds))

function findEvent(eventId: string | null) {
  if (!eventId) {
    return null
  }

  return atlas.historicEvents.find((event) => event.id === eventId) ?? null
}

function getChapterForEvent(eventId: string) {
  const event = findEvent(eventId)
  const linkedChapter = atlas.chapterScenes.find((chapter) => chapter.focusEventIds.includes(eventId))

  return linkedChapter ?? (event ? getChapterForYear(atlas.chapterScenes, event.year) : atlas.activeChapter.value)
}

function openEventPage(eventId: string) {
  showEvidenceModal.value = false
  atlas.selectEvent(eventId)
  navigateTo({
    path: '/events',
    query: {
      year: atlas.activeYear.value,
      event: eventId,
      countries: atlas.selectedCountryIds.value.join(','),
      lang: atlas.language.value,
    },
  })
}

function openProcess(chapter = atlas.activeChapter.value, eventId: string | null = null) {
  processChapter.value = chapter
  processEventId.value = eventId
  showEvidenceModal.value = true
  previewEventId.value = null
}

function openProcessForEvent(eventId: string) {
  atlas.selectEvent(eventId)
  openProcess(getChapterForEvent(eventId), eventId)
}

function closeProcessModal() {
  showEvidenceModal.value = false
}

function handlePreviewEvent(eventId: string | null) {
  if (previewClearTimer) {
    window.clearTimeout(previewClearTimer)
    previewClearTimer = null
  }

  if (eventId) {
    previewEventId.value = eventId
    return
  }

  previewClearTimer = window.setTimeout(() => {
    previewEventId.value = null
    previewClearTimer = null
  }, 180)
}

function keepPreviewOpen() {
  if (previewClearTimer) {
    window.clearTimeout(previewClearTimer)
    previewClearTimer = null
  }
}

function isActiveEvent(event: HistoricEvent) {
  return event.id === atlas.selectedEventId.value
}

function isChapterEvent(event: HistoricEvent) {
  return activeChapterEventIds.value.has(event.id)
}

function openArtist(artistId: string) {
  atlas.selectArtist(artistId)
}

function getPrimaryWorkLine(artist: ArtistMarker) {
  const work = artist.representativeWorks[0]
  if (!work) {
    return ''
  }

  return `${work.title} · ${getArtistWorkNote(work, atlas.language.value)}`
}

function getChapterDetail(chapter: ChapterScene) {
  return atlas.language.value === 'zh' ? chapter.detailZh : chapter.detailEn
}

function getEvidenceLabel(point: ChapterEvidencePoint) {
  return atlas.language.value === 'zh' ? point.labelZh : point.labelEn
}

function getEvidenceTitle(point: ChapterEvidencePoint) {
  return atlas.language.value === 'zh' ? point.titleZh : point.titleEn
}

function getEvidenceBody(point: ChapterEvidencePoint) {
  return atlas.language.value === 'zh' ? point.bodyZh : point.bodyEn
}

function getEventLongDescription(event: HistoricEvent) {
  return atlas.language.value === 'zh'
    ? event.longDescriptionZh ?? event.descriptionZh
    : event.longDescriptionEn ?? event.descriptionEn
}

function getEventMusicImpact(event: HistoricEvent) {
  return atlas.language.value === 'zh' ? event.musicImpactZh : event.musicImpactEn
}

function getEventImageAlt(event: HistoricEvent) {
  if (!event.image) {
    return ''
  }

  return atlas.language.value === 'zh' ? event.image.altZh : event.image.altEn
}

function getEventCountryLine(event: HistoricEvent) {
  return event.affectedCountryIds
    .map((countryId) => atlas.countries.find((country) => country.id === countryId))
    .filter((country): country is NonNullable<typeof country> => Boolean(country))
    .map((country) => getCountryName(country, atlas.language.value))
    .join(' / ')
}

function getSongNote(song: RelatedSong) {
  return atlas.language.value === 'zh' ? song.noteZh : song.noteEn
}

onBeforeUnmount(() => {
  if (previewClearTimer) {
    window.clearTimeout(previewClearTimer)
  }
})
</script>

<template>
  <main class="home-page">
    <section class="home-hero" aria-label="3D globe atlas">
      <div class="hero-stage">
        <Suspense>
          <GlobeStage
            chrome="minimal"
            :active-year="atlas.activeYear.value"
            :countries="atlas.countries"
            :enabled-layers="atlas.enabledLayers.value"
            :events="atlas.historicEvents"
            :focus-pose="atlas.focusPose.value"
            :language="atlas.language.value"
            :selected-artist-id="atlas.selectedArtistId.value"
            :selected-country-ids="atlas.selectedCountryIds.value"
            @preview-event="handlePreviewEvent"
            @select-artist="openArtist"
            @select-country="atlas.toggleCountry"
            @select-event="openProcessForEvent"
          />
          <template #fallback>
            <div class="stage-loading">{{ atlas.language.value === 'zh' ? '正在载入地球舞台' : 'Loading globe stage' }}</div>
          </template>
        </Suspense>
      </div>

      <aside class="story-panel" data-testid="home-story-panel">
        <p class="kicker">{{ atlas.language.value === 'zh' ? '咆哮的40年代' : 'ROARING FORTIES' }}</p>
        <h1>{{ atlas.language.value === 'zh' ? '咆哮的40年代--音乐如何在战争中演变' : 'The Roaring Forties -- How Music Evolved in War' }}</h1>
        <p class="project-intro">
          {{
            atlas.language.value === 'zh'
              ? '作为二战音乐爱好者，我总想知道军歌、爵士广播、流亡作曲家和战后唱片之间究竟如何相互牵动。这个项目把 1931-1949 年的关键事件、国家风格和代表音乐家放在同一张地图上，追踪音乐如何穿过战场、广播、迁徙与记忆，最终改变战后的声音语言。'
              : 'Built from the curiosity of a WWII music listener, this atlas asks how marches, jazz broadcasts, exiled composers, and postwar records shaped one another. It places 1931-1949 events, national styles, and featured musicians on one map to trace how music moved through battlefields, radio, migration, and memory.'
          }}
        </p>

        <div class="chapter-strip" aria-label="Story chapters">
          <button
            v-for="(chapter, index) in atlas.chapterScenes"
            :key="chapter.id"
            type="button"
            :class="{ active: chapter.id === atlas.activeChapter.value.id }"
            @click="atlas.jumpChapter(chapter.id)"
          >
            <em>{{ String(index + 1).padStart(2, '0') }}</em>
            <span>{{ getChapterTitle(chapter, atlas.language.value) }}</span>
            <small>{{ chapter.yearRange[0] }}-{{ chapter.yearRange[1] }}</small>
          </button>
        </div>

        <div class="panel-tools">
          <button type="button" class="play-button" data-testid="timeline-play" @click="atlas.togglePlay">
            {{ atlas.isPlaying.value ? (atlas.language.value === 'zh' ? '暂停' : 'Pause') : atlas.language.value === 'zh' ? '播放' : 'Play' }}
          </button>
          <label>
            <span>{{ atlas.activeYear.value }}</span>
            <input
              data-testid="timeline-range"
              type="range"
              min="1931"
              max="1949"
              :value="atlas.activeYear.value"
              @input="atlas.setYear(Number(($event.target as HTMLInputElement).value))"
            >
          </label>
        </div>

        <div class="layer-row">
          <button
            v-for="layer in layers"
            :key="layer"
            type="button"
            :class="{ active: atlas.enabledLayers.value.includes(layer) }"
            @click="atlas.toggleLayer(layer)"
          >
            {{
              layer === 'styles'
                ? atlas.language.value === 'zh' ? '风格' : 'Styles'
                : layer === 'events'
                  ? atlas.language.value === 'zh' ? '事件' : 'Events'
                  : atlas.language.value === 'zh' ? '影响' : 'Influence'
            }}
          </button>
        </div>
      </aside>

      <aside class="event-rail" data-testid="home-event-rail" aria-label="Key event timeline">
        <p class="kicker">{{ atlas.language.value === 'zh' ? '关键事件时间轴' : 'Key Event Timeline' }}</p>
        <div class="event-rail-list">
          <button
            v-for="event in atlas.historicEvents"
            :key="event.id"
            type="button"
            class="event-rail-item"
            :class="{ active: isActiveEvent(event), 'in-chapter': isChapterEvent(event) }"
            @click="openProcessForEvent(event.id)"
          >
            <span class="event-year">{{ event.year }}</span>
            <span class="event-node" aria-hidden="true" />
            <span class="event-copy">
              <strong>{{ getEventTitle(event, atlas.language.value) }}</strong>
              <small>{{ getEventDescription(event, atlas.language.value) }}</small>
            </span>
          </button>
        </div>
      </aside>

      <aside
        v-if="previewEvent && previewChapter"
        class="event-preview"
        data-testid="event-preview"
        @pointerenter="keepPreviewOpen"
        @pointerleave="handlePreviewEvent(null)"
        @focusin="keepPreviewOpen"
        @focusout="handlePreviewEvent(null)"
      >
        <p class="kicker">{{ previewEvent.year }}</p>
        <h2>{{ getEventTitle(previewEvent, atlas.language.value) }}</h2>
        <p>{{ getChapterSummary(previewChapter, atlas.language.value) }}</p>
        <div class="preview-steps">
          <span v-for="point in previewChapter.evidencePoints" :key="`preview-${point.kind}`">
            <small>{{ getEvidenceLabel(point) }}</small>
            <strong>{{ getEvidenceTitle(point) }}</strong>
          </span>
        </div>
        <button type="button" class="preview-open-button" @click="openProcessForEvent(previewEvent.id)">
          {{ atlas.language.value === 'zh' ? '展开发展过程' : 'View process' }}
        </button>
      </aside>
    </section>

    <section class="home-docks" aria-label="Chapter detail panels">
      <section class="connection-chain dock-panel" data-testid="home-connection-chain">
        <p class="kicker">{{ atlas.language.value === 'zh' ? '发展过程' : 'Development Process' }}</p>
        <div class="chain-steps">
          <article v-for="(point, index) in atlas.activeChapter.value.evidencePoints" :key="point.kind">
            <span>{{ String(index + 1).padStart(2, '0') }}</span>
            <small>{{ getEvidenceLabel(point) }}</small>
            <strong>{{ getEvidenceTitle(point) }}</strong>
            <em>{{ getEvidenceBody(point) }}</em>
          </article>
        </div>
        <button
          type="button"
          class="evidence-trigger"
          data-testid="open-evidence-modal"
          @click="openProcess()"
        >
          {{ atlas.language.value === 'zh' ? '展开发展过程' : 'View development process' }}
        </button>
      </section>

      <section class="artist-dock dock-panel" data-testid="home-artist-dock">
        <p class="kicker">{{ atlas.language.value === 'zh' ? '相关音乐家' : 'Linked Artists' }}</p>
        <div class="artist-card-list">
          <button
            v-for="artist in evidenceArtists"
            :key="artist.id"
            type="button"
            :class="{ active: artist.id === atlas.selectedArtistId.value }"
            @click="openArtist(artist.id)"
          >
            <img :src="artist.portrait.src" :alt="atlas.language.value === 'zh' ? artist.portrait.altZh : artist.portrait.altEn">
            <span>
              <strong>{{ atlas.language.value === 'zh' ? artist.nameZh : artist.nameEn }}</strong>
              <small>{{ getArtistRole(artist, atlas.language.value) }}</small>
              <em>{{ getPrimaryWorkLine(artist) }}</em>
            </span>
          </button>
        </div>
      </section>
    </section>

    <div
      v-if="showEvidenceModal"
      class="evidence-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="atlas.language.value === 'zh' ? '章节发展过程详情' : 'Chapter development process details'"
      data-testid="evidence-modal"
    >
      <div class="evidence-backdrop" @click="closeProcessModal" />
      <section class="evidence-card">
        <header class="evidence-head">
          <figure>
            <img
              :src="activeProcessChapter.thumbnail.src"
              :alt="atlas.language.value === 'zh' ? activeProcessChapter.thumbnail.altZh : activeProcessChapter.thumbnail.altEn"
            >
          </figure>
          <div>
            <p class="kicker">{{ activeProcessChapter.yearRange[0] }}-{{ activeProcessChapter.yearRange[1] }}</p>
            <h2>{{ getChapterTitle(activeProcessChapter, atlas.language.value) }}</h2>
            <p>{{ getChapterDetail(activeProcessChapter) }}</p>
            <p v-if="processEvent" class="focused-event-line">
              {{ getEventTitle(processEvent, atlas.language.value) }}
            </p>
          </div>
          <button class="evidence-close" type="button" @click="closeProcessModal">
            {{ atlas.language.value === 'zh' ? '关闭' : 'Close' }}
          </button>
        </header>

        <div class="evidence-section">
          <p class="kicker">{{ atlas.language.value === 'zh' ? '阅读路径' : 'Reading Path' }}</p>
          <div class="modal-evidence-grid">
            <article v-for="point in activeProcessChapter.evidencePoints" :key="`modal-${point.kind}`">
              <small>{{ getEvidenceLabel(point) }}</small>
              <strong>{{ getEvidenceTitle(point) }}</strong>
              <p>{{ getEvidenceBody(point) }}</p>
            </article>
          </div>
        </div>

        <div class="evidence-section">
          <p class="kicker">{{ atlas.language.value === 'zh' ? '关联事件与声音证据' : 'Linked Events and Sound Evidence' }}</p>
          <div class="modal-event-list">
            <article
              v-for="event in processEvents"
              :key="`modal-${event.id}`"
              :class="{ focused: processEvent?.id === event.id }"
            >
              <img v-if="event.image" :src="event.image.src" :alt="getEventImageAlt(event)" loading="lazy">
              <div class="modal-event-copy">
                <div class="modal-event-meta">
                  <span>{{ event.year }}</span>
                  <small>{{ getEventCountryLine(event) }}</small>
                </div>
                <h3>{{ getEventTitle(event, atlas.language.value) }}</h3>
                <p>{{ getEventLongDescription(event) }}</p>
                <p v-if="getEventMusicImpact(event)" class="music-impact">{{ getEventMusicImpact(event) }}</p>
                <div v-if="event.relatedSongs?.length" class="song-evidence-list">
                  <span v-for="song in event.relatedSongs.slice(0, 3)" :key="`${event.id}-${song.title}`">
                    <strong>{{ song.title }}</strong>
                    <small>{{ song.performer }} · {{ song.year }}</small>
                    <em>{{ getSongNote(song) }}</em>
                  </span>
                </div>
                <button type="button" class="event-open-button" @click="openEventPage(event.id)">
                  {{ atlas.language.value === 'zh' ? '进入事件页' : 'Open event page' }}
                </button>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.home-page {
  position: relative;
  min-height: 100svh;
  overflow-x: hidden;
}

.home-hero {
  position: relative;
  isolation: isolate;
  display: grid;
  align-items: start;
  min-height: 100svh;
  padding: 5.8rem clamp(1rem, 2vw, 1.4rem) 2rem;
  overflow: hidden;
}

.hero-stage {
  position: absolute;
  inset: 0;
  z-index: 0;
}

.stage-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--atlas-muted);
}

.story-panel,
.dock-panel,
.event-rail,
.event-preview {
  position: relative;
  z-index: 3;
  background: linear-gradient(180deg, rgba(9, 14, 20, 0.82), rgba(9, 14, 20, 0.52));
  border: 1px solid rgba(239, 228, 208, 0.1);
  backdrop-filter: blur(18px);
}

.story-panel {
  width: min(25rem, calc(100vw - 2rem));
  max-height: calc(100svh - 6.9rem);
  margin: 0;
  padding: 1rem;
  overflow: auto;
  box-shadow: var(--atlas-shadow);
}

.home-docks {
  position: relative;
  z-index: 4;
  display: grid;
  grid-template-columns: minmax(20rem, 1.05fr) minmax(18rem, 0.95fr);
  gap: 1rem;
  padding: 1rem 1.2rem 1.6rem;
  background:
    radial-gradient(circle at 18% 0%, rgba(201, 143, 88, 0.1), transparent 28rem),
    linear-gradient(180deg, rgba(7, 10, 15, 0.92), #0c1118 42%, #111922 100%);
}

.dock-panel {
  min-width: 0;
  padding: 1rem;
  align-self: start;
}

.kicker {
  margin: 0;
  color: var(--atlas-accent);
  font-size: 0.72rem;
  letter-spacing: 0.24em;
  text-transform: uppercase;
}

h1,
h2 {
  margin: 0;
  font-family: Georgia, 'Times New Roman', 'Noto Serif SC', serif;
  line-height: 0.96;
}

h1 {
  max-width: 11.5em;
  margin-top: 0.45rem;
  font-size: clamp(1.9rem, 2.7vw, 3.15rem);
  overflow-wrap: anywhere;
}

h2 {
  font-size: clamp(1.35rem, 2vw, 2rem);
}

p {
  margin: 0.8rem 0 0;
  color: var(--atlas-muted);
}

.project-intro {
  max-width: 28rem;
  line-height: 1.55;
}

.chapter-strip,
.event-list,
.chain-steps,
.artist-card-list {
  display: grid;
  gap: 0.5rem;
  margin-top: 1rem;
}

.chapter-strip {
  grid-template-columns: 1fr;
}

.chapter-strip button,
.layer-row button,
.play-button,
.event-list button,
.evidence-trigger,
.evidence-close,
.event-open-button,
.event-rail-item,
.preview-open-button {
  border: 1px solid rgba(239, 228, 208, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: var(--atlas-text);
  cursor: pointer;
}

.chapter-strip button {
  display: grid;
  grid-template-columns: 2rem minmax(0, 1fr) auto;
  gap: 0.35rem;
  min-height: 0;
  padding: 0.52rem 0.58rem;
  align-items: center;
  text-align: left;
  overflow: hidden;
}

.chapter-strip em {
  color: var(--atlas-accent);
  font-family: Georgia, 'Times New Roman', 'Noto Serif SC', serif;
  font-size: 0.82rem;
  font-style: normal;
}

.chapter-strip span {
  min-width: 0;
  font-size: 0.82rem;
  line-height: 1.2;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chapter-strip small {
  justify-self: end;
}

.chapter-strip small,
.event-list small {
  color: rgba(239, 228, 208, 0.58);
}

.chapter-strip button.active,
.layer-row button.active {
  background: rgba(201, 143, 88, 0.16);
  border-color: rgba(201, 143, 88, 0.42);
}

.panel-tools {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 0.75rem;
  align-items: center;
  margin-top: 0.85rem;
}

.play-button {
  padding: 0.62rem 0.78rem;
}

.panel-tools label {
  display: grid;
  gap: 0.3rem;
}

.panel-tools label span {
  font-family: Georgia, 'Times New Roman', 'Noto Serif SC', serif;
  font-size: 1.45rem;
}

.layer-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
  margin-top: 0.85rem;
}

.layer-row button {
  padding: 0.44rem 0.66rem;
}

.event-rail {
  position: absolute;
  top: 5.8rem;
  right: 1.2rem;
  bottom: 2rem;
  width: min(25rem, 31vw);
  display: grid;
  grid-template-rows: auto minmax(0, 1fr);
  gap: 0.75rem;
  padding: 0.95rem;
  overflow: hidden;
  box-shadow: var(--atlas-shadow);
}

.event-rail-list {
  position: relative;
  display: grid;
  gap: 0.32rem;
  overflow: auto;
  padding: 0.1rem 0 0.3rem;
}

.event-rail-list::before {
  content: '';
  position: absolute;
  top: 0.35rem;
  bottom: 0.55rem;
  left: 4.15rem;
  width: 1px;
  background: linear-gradient(180deg, transparent, rgba(201, 143, 88, 0.52), transparent);
}

.event-rail-item {
  position: relative;
  display: grid;
  grid-template-columns: 3.35rem 1.15rem minmax(0, 1fr);
  gap: 0.55rem;
  align-items: start;
  padding: 0.46rem 0.42rem;
  text-align: left;
  transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.event-rail-item:hover,
.event-rail-item:focus-visible,
.event-rail-item.active {
  background: rgba(201, 143, 88, 0.14);
  border-color: rgba(201, 143, 88, 0.38);
}

.event-rail-item.in-chapter:not(.active) {
  border-color: rgba(239, 228, 208, 0.2);
  background: rgba(255, 255, 255, 0.055);
}

.event-year {
  color: var(--atlas-accent);
  font-family: Georgia, 'Times New Roman', 'Noto Serif SC', serif;
  font-size: 1rem;
  line-height: 1.1;
}

.event-node {
  position: relative;
  z-index: 1;
  width: 0.64rem;
  height: 0.64rem;
  margin-top: 0.18rem;
  border-radius: 999px;
  background: rgba(239, 228, 208, 0.45);
  box-shadow: 0 0 0 0.32rem rgba(239, 228, 208, 0.06);
}

.event-rail-item.active .event-node,
.event-rail-item.in-chapter .event-node {
  background: var(--atlas-accent);
  box-shadow: 0 0 0 0.32rem rgba(201, 143, 88, 0.18);
}

.event-copy {
  display: grid;
  gap: 0.18rem;
  min-width: 0;
}

.event-copy strong {
  color: var(--atlas-text);
  font-size: 0.86rem;
  line-height: 1.2;
  overflow-wrap: anywhere;
}

.event-copy small {
  display: -webkit-box;
  overflow: hidden;
  color: rgba(239, 228, 208, 0.58);
  font-size: 0.72rem;
  line-height: 1.35;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.event-preview {
  position: absolute;
  left: 1.2rem;
  bottom: 2rem;
  width: min(23rem, 30vw);
  display: grid;
  gap: 0.65rem;
  padding: 0.9rem;
  box-shadow: 0 22px 70px rgba(0, 0, 0, 0.38);
}

.event-preview h2 {
  font-size: clamp(1.15rem, 1.6vw, 1.55rem);
}

.event-preview p {
  margin-top: 0;
  line-height: 1.5;
}

.preview-steps {
  display: grid;
  gap: 0.45rem;
}

.preview-steps span {
  display: grid;
  gap: 0.16rem;
  padding-top: 0.45rem;
  border-top: 1px solid rgba(239, 228, 208, 0.08);
}

.preview-steps small {
  color: var(--atlas-accent);
  font-size: 0.68rem;
  letter-spacing: 0.14em;
  text-transform: uppercase;
}

.preview-steps strong {
  color: var(--atlas-text);
  font-size: 0.82rem;
  line-height: 1.25;
}

.preview-open-button {
  justify-self: start;
  padding: 0.54rem 0.72rem;
  background: rgba(201, 143, 88, 0.14);
  border-color: rgba(201, 143, 88, 0.34);
}

.connection-chain {
  display: grid;
  align-content: start;
}

.chain-steps {
  gap: 0.45rem;
}

.chain-steps article {
  display: grid;
  grid-template-columns: 2.2rem 1fr;
  gap: 0.12rem 0.65rem;
  padding: 0.58rem;
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(239, 228, 208, 0.08);
}

.chain-steps span {
  grid-row: span 3;
  color: var(--atlas-accent);
  font-family: Georgia, 'Times New Roman', 'Noto Serif SC', serif;
}

.chain-steps strong,
.artist-card-list strong {
  color: var(--atlas-text);
  overflow-wrap: anywhere;
}

.chain-steps small,
.artist-card-list small,
.artist-card-list em,
.chain-steps em {
  color: rgba(239, 228, 208, 0.62);
  line-height: 1.35;
}

.chain-steps em {
  display: -webkit-box;
  overflow: hidden;
  font-size: 0.76rem;
  font-style: normal;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.evidence-trigger {
  width: 100%;
  margin-top: 0.7rem;
  padding: 0.7rem 0.9rem;
  background: rgba(201, 143, 88, 0.15);
  border-color: rgba(201, 143, 88, 0.36);
}

.artist-dock {
  display: grid;
  align-content: start;
}

.artist-card-list button {
  display: grid;
  grid-template-columns: 3.8rem minmax(0, 1fr);
  gap: 0.65rem;
  align-items: start;
  padding: 0.6rem;
  border: 1px solid rgba(239, 228, 208, 0.1);
  background: rgba(255, 255, 255, 0.035);
  color: var(--atlas-text);
  text-align: left;
  cursor: pointer;
}

.artist-card-list button.active,
.artist-card-list button:hover {
  background: rgba(201, 143, 88, 0.14);
  border-color: rgba(201, 143, 88, 0.36);
}

.artist-card-list img {
  width: 100%;
  aspect-ratio: 3 / 4;
  object-fit: cover;
  border: 1px solid rgba(239, 228, 208, 0.12);
}

.artist-card-list span {
  display: grid;
  gap: 0.25rem;
  min-width: 0;
}

.artist-card-list em {
  display: -webkit-box;
  overflow: hidden;
  font-style: normal;
  line-clamp: 3;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
}

.event-list button {
  display: grid;
  grid-template-columns: 3.4rem 1fr;
  gap: 0.3rem 0.8rem;
  padding: 0.72rem;
  text-align: left;
}

.event-list span {
  grid-row: span 2;
  color: var(--atlas-accent);
  font-family: Georgia, 'Times New Roman', 'Noto Serif SC', serif;
  font-size: 1.25rem;
}

.event-list small {
  display: -webkit-box;
  overflow: hidden;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}

.evidence-modal {
  position: fixed;
  inset: 0;
  z-index: 40;
  display: grid;
  place-items: center;
  padding: 1rem;
}

.evidence-backdrop {
  position: absolute;
  inset: 0;
  background: rgba(5, 8, 12, 0.76);
  backdrop-filter: blur(4px);
}

.evidence-card {
  position: relative;
  z-index: 1;
  display: grid;
  gap: 1.1rem;
  width: min(70rem, calc(100vw - 2rem));
  max-height: min(84svh, 58rem);
  overflow: auto;
  padding: 1rem;
  background: rgba(10, 15, 21, 0.96);
  border: 1px solid rgba(239, 228, 208, 0.14);
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.52);
}

.evidence-head {
  display: grid;
  grid-template-columns: minmax(12rem, 22rem) minmax(0, 1fr) auto;
  gap: 1rem;
  align-items: start;
}

.evidence-head figure {
  margin: 0;
}

.evidence-head img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  border: 1px solid rgba(239, 228, 208, 0.12);
}

.evidence-head p {
  max-width: 58rem;
  line-height: 1.65;
}

.focused-event-line {
  width: fit-content;
  padding: 0.36rem 0.56rem;
  background: rgba(201, 143, 88, 0.12);
  border: 1px solid rgba(201, 143, 88, 0.28);
  color: var(--atlas-text);
}

.evidence-close {
  padding: 0.58rem 0.78rem;
}

.evidence-section {
  display: grid;
  gap: 0.75rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(239, 228, 208, 0.1);
}

.modal-evidence-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.7rem;
}

.modal-evidence-grid article,
.modal-event-list article {
  background: rgba(255, 255, 255, 0.035);
  border: 1px solid rgba(239, 228, 208, 0.08);
}

.modal-evidence-grid article {
  display: grid;
  gap: 0.4rem;
  padding: 0.85rem;
}

.modal-evidence-grid small,
.modal-event-meta,
.song-evidence-list small,
.song-evidence-list em {
  color: rgba(239, 228, 208, 0.6);
}

.modal-evidence-grid strong,
.modal-event-list h3,
.song-evidence-list strong {
  color: var(--atlas-text);
}

.modal-evidence-grid p,
.modal-event-list p,
.song-evidence-list em {
  margin: 0;
  line-height: 1.55;
}

.modal-event-list {
  display: grid;
  gap: 0.75rem;
}

.modal-event-list article {
  display: grid;
  grid-template-columns: minmax(12rem, 18rem) minmax(0, 1fr);
  gap: 0.9rem;
  padding: 0.75rem;
}

.modal-event-list article.focused {
  border-color: rgba(201, 143, 88, 0.42);
  background: rgba(201, 143, 88, 0.08);
}

.modal-event-list img {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border: 1px solid rgba(239, 228, 208, 0.1);
}

.modal-event-copy {
  display: grid;
  gap: 0.55rem;
  align-content: start;
}

.modal-event-copy h3 {
  margin: 0;
  font-family: Georgia, 'Times New Roman', 'Noto Serif SC', serif;
  font-size: 1.25rem;
}

.modal-event-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  align-items: center;
  font-size: 0.78rem;
}

.modal-event-meta span {
  color: var(--atlas-accent);
  font-family: Georgia, 'Times New Roman', 'Noto Serif SC', serif;
  font-size: 1.15rem;
}

.music-impact {
  padding: 0.65rem 0.75rem;
  background: rgba(201, 143, 88, 0.08);
  border-left: 2px solid rgba(201, 143, 88, 0.48);
}

.song-evidence-list {
  display: grid;
  gap: 0.4rem;
}

.song-evidence-list span {
  display: grid;
  gap: 0.12rem;
  padding: 0.55rem 0;
  border-top: 1px solid rgba(239, 228, 208, 0.08);
}

.song-evidence-list em {
  font-style: normal;
}

.event-open-button {
  justify-self: start;
  padding: 0.58rem 0.8rem;
}

@media (max-width: 1180px) {
  .home-hero {
    grid-template-columns: minmax(0, 1fr) minmax(19rem, 0.9fr);
    gap: 1rem;
    min-height: auto;
    padding: 8.6rem 1rem 1rem;
    overflow: visible;
    background:
      radial-gradient(circle at 50% 6rem, rgba(201, 143, 88, 0.12), transparent 24rem),
      linear-gradient(180deg, rgba(7, 10, 15, 0.96), rgba(9, 14, 20, 0.82));
  }

  .hero-stage {
    position: relative;
    z-index: 1;
    grid-column: 1 / -1;
    height: clamp(22rem, 45svh, 32rem);
    min-height: 22rem;
    overflow: hidden;
  }

  .story-panel,
  .event-rail,
  .event-preview {
    width: 100%;
    max-width: none;
  }

  .story-panel {
    max-height: none;
  }

  .event-rail,
  .event-preview {
    position: relative;
    top: auto;
    right: auto;
    bottom: auto;
    left: auto;
  }

  .event-rail {
    max-height: 34rem;
  }

  .event-preview {
    grid-column: 1 / -1;
    justify-self: start;
    max-width: 36rem;
  }

  .home-docks {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .artist-dock {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .home-hero {
    grid-template-columns: 1fr;
    padding-top: 8.6rem;
  }

  .hero-stage {
    height: clamp(18rem, 42svh, 26rem);
    min-height: 18rem;
  }

  .event-rail {
    max-height: 30rem;
  }

  .home-docks {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    padding: 0.9rem 1rem 1.2rem;
  }

  .artist-dock {
    grid-column: auto;
  }
}

@media (max-width: 760px) {
  .home-hero {
    align-items: start;
    padding: 8.8rem 0.75rem 1rem;
  }

  .hero-stage {
    height: clamp(16rem, 38svh, 22rem);
    min-height: 16rem;
  }

  .story-panel {
    width: 100%;
    max-height: none;
    padding: 0.9rem;
  }

  h1 {
    max-width: none;
    font-size: clamp(1.65rem, 8.8vw, 2.45rem);
    line-height: 1.04;
  }

  .chapter-strip {
    display: flex;
    gap: 0.55rem;
    margin-right: -1rem;
    padding-right: 1rem;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
  }

  .chapter-strip button {
    flex: 0 0 14rem;
    min-height: 0;
    scroll-snap-align: start;
  }

  .event-rail {
    width: 100%;
    max-height: 26rem;
    padding: 0.85rem;
  }

  .event-rail-item {
    grid-template-columns: 3.2rem 1rem minmax(0, 1fr);
    padding: 0.44rem 0.38rem;
  }

  .event-preview {
    width: 100%;
    padding: 0.85rem;
  }

  .panel-tools {
    grid-template-columns: 1fr;
    gap: 0.65rem;
  }

  .play-button {
    justify-self: start;
  }

  .home-docks {
    grid-template-columns: 1fr;
    gap: 0.8rem;
    padding: 0.8rem 0.75rem 1.1rem;
  }

  .dock-panel {
    padding: 0.9rem;
  }

  .artist-dock {
    grid-column: auto;
  }

  .artist-card-list button {
    grid-template-columns: 3.2rem minmax(0, 1fr);
  }

  .evidence-head,
  .modal-event-list article {
    grid-template-columns: 1fr;
  }

  .modal-evidence-grid {
    grid-template-columns: 1fr;
  }

  .evidence-close {
    justify-self: start;
  }
}
</style>
