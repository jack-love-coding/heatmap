<script setup lang="ts">
import { computed, defineAsyncComponent, ref } from 'vue'
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
} from '@/lib/atlas'
import type { ArtistMarker } from '@/data/atlasMarkers'
import type { ChapterEvidencePoint, ChapterScene, HistoricEvent, LayerKey, RelatedSong } from '@/data/ww2MusicAtlas'

const GlobeStage = defineAsyncComponent(() => import('@/components/GlobeStage.vue'))
const atlas = useAtlasState()
const showEvidenceModal = ref(false)

const chapterEvents = computed(() =>
  atlas.activeChapter.value.focusEventIds
    .map((eventId) => atlas.historicEvents.find((event) => event.id === eventId))
    .filter((event): event is NonNullable<typeof event> => Boolean(event)),
)

const layers: LayerKey[] = ['styles', 'events', 'influence']
const evidenceArtists = computed(() =>
  getFeaturedArtistsForContext({
    activeEvent: atlas.activeEvent.value,
    countryDetails: atlas.countryDetails.value,
    activeYear: atlas.activeYear.value,
    limit: 5,
  }),
)

function openEvent(eventId: string) {
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
</script>

<template>
  <main class="home-page">
    <section class="hero-stage" aria-label="3D globe atlas">
      <Suspense>
        <GlobeStage
          :active-year="atlas.activeYear.value"
          :countries="atlas.countries"
          :enabled-layers="atlas.enabledLayers.value"
          :events="atlas.historicEvents"
          :focus-pose="atlas.focusPose.value"
          :language="atlas.language.value"
          :selected-artist-id="atlas.selectedArtistId.value"
          :selected-country-ids="atlas.selectedCountryIds.value"
          @select-artist="openArtist"
          @select-country="atlas.toggleCountry"
          @select-event="openEvent"
        />
        <template #fallback>
          <div class="stage-loading">{{ atlas.language.value === 'zh' ? '正在载入地球舞台' : 'Loading globe stage' }}</div>
        </template>
      </Suspense>
    </section>

    <aside class="story-panel" data-testid="home-story-panel">
      <p class="kicker">WWII MUSIC ATLAS</p>
      <h1>{{ atlas.language.value === 'zh' ? '战争如何改变音乐地图' : 'How War Rewired the Musical Map' }}</h1>
      <p>
        {{
          atlas.language.value === 'zh'
            ? '以地球、时间轴和关键事件追踪 1931-1949 年间八个国家的音乐风格转向。'
            : 'Track how eight countries changed musically between 1931 and 1949 through globe, timeline, and historical rupture.'
        }}
      </p>

      <div class="chapter-strip" aria-label="Story chapters">
        <button
          v-for="chapter in atlas.chapterScenes"
          :key="chapter.id"
          type="button"
          :class="{ active: chapter.id === atlas.activeChapter.value.id }"
          @click="atlas.jumpChapter(chapter.id)"
        >
          <img :src="chapter.thumbnail.src" :alt="atlas.language.value === 'zh' ? chapter.thumbnail.altZh : chapter.thumbnail.altEn">
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

      <section class="connection-chain" data-testid="home-connection-chain">
        <p class="kicker">{{ atlas.language.value === 'zh' ? '证据链' : 'Evidence Chain' }}</p>
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
          @click="showEvidenceModal = true"
        >
          {{ atlas.language.value === 'zh' ? '展开证据链' : 'Open evidence' }}
        </button>
      </section>
    </aside>

    <section class="event-dock" data-testid="home-event-dock">
      <p class="kicker">{{ atlas.language.value === 'zh' ? '重大事件' : 'Key Events' }}</p>
      <h2>{{ getChapterTitle(atlas.activeChapter.value, atlas.language.value) }}</h2>
      <p>{{ getChapterSummary(atlas.activeChapter.value, atlas.language.value) }}</p>
      <div class="event-list">
        <button v-for="event in chapterEvents" :key="event.id" type="button" @click="openEvent(event.id)">
          <span>{{ event.year }}</span>
          <strong>{{ getEventTitle(event, atlas.language.value) }}</strong>
          <small>{{ getEventDescription(event, atlas.language.value) }}</small>
        </button>
      </div>
    </section>

    <section class="artist-dock" data-testid="home-artist-dock">
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

    <div
      v-if="showEvidenceModal"
      class="evidence-modal"
      role="dialog"
      aria-modal="true"
      :aria-label="atlas.language.value === 'zh' ? '章节证据链详情' : 'Chapter evidence details'"
      data-testid="evidence-modal"
    >
      <div class="evidence-backdrop" @click="showEvidenceModal = false" />
      <section class="evidence-card">
        <header class="evidence-head">
          <figure>
            <img
              :src="atlas.activeChapter.value.thumbnail.src"
              :alt="atlas.language.value === 'zh' ? atlas.activeChapter.value.thumbnail.altZh : atlas.activeChapter.value.thumbnail.altEn"
            >
          </figure>
          <div>
            <p class="kicker">{{ atlas.activeChapter.value.yearRange[0] }}-{{ atlas.activeChapter.value.yearRange[1] }}</p>
            <h2>{{ getChapterTitle(atlas.activeChapter.value, atlas.language.value) }}</h2>
            <p>{{ getChapterDetail(atlas.activeChapter.value) }}</p>
          </div>
          <button class="evidence-close" type="button" @click="showEvidenceModal = false">
            {{ atlas.language.value === 'zh' ? '关闭' : 'Close' }}
          </button>
        </header>

        <div class="evidence-section">
          <p class="kicker">{{ atlas.language.value === 'zh' ? '阅读路径' : 'Reading Path' }}</p>
          <div class="modal-evidence-grid">
            <article v-for="point in atlas.activeChapter.value.evidencePoints" :key="`modal-${point.kind}`">
              <small>{{ getEvidenceLabel(point) }}</small>
              <strong>{{ getEvidenceTitle(point) }}</strong>
              <p>{{ getEvidenceBody(point) }}</p>
            </article>
          </div>
        </div>

        <div class="evidence-section">
          <p class="kicker">{{ atlas.language.value === 'zh' ? '关联事件与声音证据' : 'Linked Events and Sound Evidence' }}</p>
          <div class="modal-event-list">
            <article v-for="event in chapterEvents" :key="`modal-${event.id}`">
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
                <button type="button" class="event-open-button" @click="openEvent(event.id)">
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
  overflow: hidden;
}

.hero-stage {
  position: absolute;
  inset: 0;
}

.stage-loading {
  position: absolute;
  inset: 0;
  display: grid;
  place-items: center;
  color: var(--atlas-muted);
}

.story-panel,
.event-dock {
  position: relative;
  z-index: 3;
  background: linear-gradient(180deg, rgba(9, 14, 20, 0.82), rgba(9, 14, 20, 0.52));
  border: 1px solid rgba(239, 228, 208, 0.1);
  backdrop-filter: blur(18px);
}

.story-panel {
  width: min(31rem, calc(100vw - 2rem));
  margin: 6.4rem 0 0 1.2rem;
  padding: 1.25rem;
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
  max-width: 9ch;
  margin-top: 0.55rem;
  font-size: clamp(2.8rem, 5vw, 5.4rem);
}

h2 {
  font-size: clamp(1.35rem, 2vw, 2rem);
}

p {
  margin: 0.8rem 0 0;
  color: var(--atlas-muted);
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
  grid-template-columns: repeat(5, minmax(0, 1fr));
}

.chapter-strip button,
.layer-row button,
.play-button,
.event-list button,
.evidence-trigger,
.evidence-close,
.event-open-button {
  border: 1px solid rgba(239, 228, 208, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: var(--atlas-text);
  cursor: pointer;
}

.chapter-strip button {
  display: grid;
  gap: 0.2rem;
  min-height: 5rem;
  padding: 0.38rem;
  text-align: left;
  overflow: hidden;
}

.chapter-strip img {
  width: 100%;
  aspect-ratio: 16 / 10;
  object-fit: cover;
  opacity: 0.78;
  filter: sepia(0.25) contrast(1.04);
}

.chapter-strip span {
  padding: 0 0.2rem;
  font-size: 0.8rem;
  line-height: 1.2;
}

.chapter-strip small {
  padding: 0 0.2rem 0.18rem;
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
  gap: 0.9rem;
  align-items: center;
  margin-top: 1rem;
}

.play-button {
  padding: 0.72rem 0.95rem;
}

.panel-tools label {
  display: grid;
  gap: 0.3rem;
}

.panel-tools label span {
  font-family: Georgia, 'Times New Roman', 'Noto Serif SC', serif;
  font-size: 1.8rem;
}

.layer-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
  margin-top: 1rem;
}

.layer-row button {
  padding: 0.5rem 0.82rem;
}

.event-dock {
  position: absolute;
  right: 1.2rem;
  bottom: 1.2rem;
  width: min(32rem, calc(100vw - 2rem));
  padding: 1rem;
}

.connection-chain {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(239, 228, 208, 0.1);
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
  position: absolute;
  right: 1.2rem;
  top: 6.4rem;
  z-index: 3;
  width: min(22rem, calc(100vw - 2rem));
  max-height: calc(100svh - 24rem);
  overflow: auto;
  padding: 1rem;
  background: linear-gradient(180deg, rgba(9, 14, 20, 0.78), rgba(9, 14, 20, 0.5));
  border: 1px solid rgba(239, 228, 208, 0.1);
  backdrop-filter: blur(18px);
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

@media (max-width: 900px) {
  .home-page {
    min-height: auto;
    overflow: visible;
    padding-top: 12rem;
  }

  .hero-stage {
    position: relative;
    min-height: 62svh;
  }

  .story-panel,
  .event-dock,
  .artist-dock {
    position: relative;
    inset: auto;
    width: auto;
    margin: 0.8rem;
    max-height: none;
  }

  .chapter-strip {
    grid-template-columns: 1fr;
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
