<script setup lang="ts">
import { computed, defineAsyncComponent } from 'vue'
import { navigateTo } from '@/router'
import { useAtlasState } from '@/composables/useAtlasState'
import { getChapterSummary, getChapterTitle, getEventDescription, getEventTitle } from '@/lib/atlas'
import type { LayerKey } from '@/data/ww2MusicAtlas'

const GlobeStage = defineAsyncComponent(() => import('@/components/GlobeStage.vue'))
const atlas = useAtlasState()

const chapterEvents = computed(() =>
  atlas.activeChapter.value.focusEventIds
    .map((eventId) => atlas.historicEvents.find((event) => event.id === eventId))
    .filter((event): event is NonNullable<typeof event> => Boolean(event)),
)

const layers: LayerKey[] = ['styles', 'events', 'influence']

function openEvent(eventId: string) {
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
          :selected-artist-id="null"
          :selected-country-ids="atlas.selectedCountryIds.value"
          @select-artist="atlas.selectArtist"
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
.event-list {
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
.event-list button {
  border: 1px solid rgba(239, 228, 208, 0.12);
  background: rgba(255, 255, 255, 0.04);
  color: var(--atlas-text);
  cursor: pointer;
}

.chapter-strip button {
  display: grid;
  gap: 0.2rem;
  min-height: 5rem;
  padding: 0.58rem;
  text-align: left;
}

.chapter-strip span {
  font-size: 0.8rem;
  line-height: 1.2;
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
  .event-dock {
    position: relative;
    inset: auto;
    width: auto;
    margin: 0.8rem;
  }

  .chapter-strip {
    grid-template-columns: 1fr;
  }
}
</style>
