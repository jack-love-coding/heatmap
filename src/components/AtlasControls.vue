<script setup lang="ts">
import type { AtlasMode, ChapterScene, CountryProfile, Language, LayerKey } from '@/data/ww2MusicAtlas'
import { getChapterTitle, getCountryName } from '@/lib/atlas'

const props = defineProps<{
  activeMode: AtlasMode
  activeChapterId: string
  enabledLayers: LayerKey[]
  language: Language
  selectedCountryIds: string[]
  countries: CountryProfile[]
  chapters: ChapterScene[]
}>()

const emit = defineEmits<{
  'update:mode': [mode: AtlasMode]
  'update:language': [language: Language]
  'toggle-layer': [layer: LayerKey]
  'toggle-country': [countryId: string]
  'jump-chapter': [chapterId: string]
}>()

function isLayerEnabled(layer: LayerKey) {
  return props.enabledLayers.includes(layer)
}
</script>

<template>
  <section class="controls" data-testid="atlas-controls">
    <p class="kicker">WWII MUSIC ATLAS</p>
    <h1 class="title">
      {{ language === 'zh' ? '咆哮的40年代--音乐如何在战争中演变' : 'The Roaring Forties -- How Music Evolved in War' }}
    </h1>
    <p class="lede">
      {{
        language === 'zh'
          ? '作为二战音乐爱好者，我总想知道军歌、爵士广播、流亡作曲家和战后唱片之间究竟如何相互牵动。这个项目把 1931-1949 年的关键事件、国家风格和代表音乐家放在同一张地图上，追踪音乐如何穿过战场、广播、迁徙与记忆，最终改变战后的声音语言。'
          : 'Built from the curiosity of a WWII music listener, this atlas asks how marches, jazz broadcasts, exiled composers, and postwar records shaped one another. It places 1931-1949 events, national styles, and featured musicians on one map to trace how music moved through battlefields, radio, migration, and memory.'
      }}
    </p>

    <div class="segmented" aria-label="Mode switch">
      <button class="segment" :class="{ active: activeMode === 'story' }" type="button" data-testid="mode-story" @click="emit('update:mode', 'story')">
        {{ language === 'zh' ? '叙事' : 'Story' }}
      </button>
      <button class="segment" :class="{ active: activeMode === 'explore' }" type="button" data-testid="mode-explore" @click="emit('update:mode', 'explore')">
        {{ language === 'zh' ? '探索' : 'Explore' }}
      </button>
    </div>

    <div class="row">
      <span class="label">{{ language === 'zh' ? '语言' : 'Language' }}</span>
      <div class="segmented compact">
        <button class="segment" :class="{ active: language === 'zh' }" type="button" data-testid="language-zh" @click="emit('update:language', 'zh')">中文</button>
        <button class="segment" :class="{ active: language === 'en' }" type="button" data-testid="language-en" @click="emit('update:language', 'en')">English</button>
      </div>
    </div>

    <div class="row">
      <span class="label">{{ language === 'zh' ? '图层' : 'Layers' }}</span>
      <div class="chip-list">
        <button
          v-for="layer in (['styles', 'events', 'influence'] as LayerKey[])"
          :key="layer"
          class="chip"
          :class="{ active: isLayerEnabled(layer) }"
          type="button"
          @click="emit('toggle-layer', layer)"
        >
          {{
            layer === 'styles'
              ? language === 'zh'
                ? '风格'
                : 'Styles'
              : layer === 'events'
                ? language === 'zh'
                  ? '事件'
                  : 'Events'
                : language === 'zh'
                  ? '影响'
                  : 'Influence'
          }}
        </button>
      </div>
    </div>

    <div v-if="activeMode === 'story'" class="story-grid">
      <button
        v-for="chapter in chapters"
        :key="chapter.id"
        class="chapter-button"
        :class="{ active: chapter.id === activeChapterId }"
        type="button"
        @click="emit('jump-chapter', chapter.id)"
      >
        <span>{{ getChapterTitle(chapter, language) }}</span>
        <small>{{ chapter.yearRange[0] }}-{{ chapter.yearRange[1] }}</small>
      </button>
    </div>

    <div v-else class="country-picker">
      <span class="label">{{ language === 'zh' ? '国家对比' : 'Country compare' }}</span>
      <div class="chip-list">
        <button
          v-for="country in countries"
          :key="country.id"
          class="chip country-chip"
          :class="{ active: selectedCountryIds.includes(country.id) }"
          type="button"
          :style="{ '--chip-color': country.color }"
          @click="emit('toggle-country', country.id)"
        >
          {{ getCountryName(country, language) }}
        </button>
      </div>
      <p class="hint">
        {{ language === 'zh' ? '最多选择两个国家进行并排阅读。' : 'Select up to two countries for side-by-side reading.' }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.controls {
  display: grid;
  gap: 1rem;
  max-width: 34rem;
  padding: 1.2rem 1.35rem 1.4rem;
  background: linear-gradient(180deg, rgba(8, 13, 19, 0.82), rgba(8, 13, 19, 0.48));
  border: 1px solid var(--atlas-line);
  backdrop-filter: blur(18px);
  box-shadow: var(--atlas-shadow);
}

.kicker,
.label {
  margin: 0;
  color: var(--atlas-accent);
  font-size: 0.72rem;
  letter-spacing: 0.28em;
  text-transform: uppercase;
}

.title {
  margin: 0;
  max-width: 10ch;
  font-family: Georgia, 'Times New Roman', 'Noto Serif SC', serif;
  font-size: clamp(2.4rem, 4vw, 4.8rem);
  line-height: 0.92;
}

.lede,
.hint {
  margin: 0;
  max-width: 34rem;
  color: var(--atlas-muted);
  font-size: 0.95rem;
}

.row,
.country-picker {
  display: grid;
  gap: 0.65rem;
}

.label {
  color: rgba(239, 228, 208, 0.62);
}

.segmented,
.chip-list,
.story-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 0.55rem;
}

.compact {
  width: fit-content;
}

.segment,
.chip,
.chapter-button {
  border: 1px solid rgba(239, 228, 208, 0.14);
  background: rgba(239, 228, 208, 0.04);
  color: var(--atlas-text);
  cursor: pointer;
  transition: background 180ms ease, border-color 180ms ease, transform 180ms ease;
}

.segment {
  padding: 0.64rem 1rem;
  min-width: 6rem;
}

.chip {
  padding: 0.5rem 0.85rem;
}

.chapter-button {
  display: grid;
  gap: 0.25rem;
  padding: 0.72rem 0.82rem;
  min-width: 10rem;
  text-align: left;
}

.chapter-button small {
  color: rgba(239, 228, 208, 0.58);
}

.country-chip::before {
  content: '';
  display: inline-block;
  width: 0.55rem;
  height: 0.55rem;
  margin-right: 0.5rem;
  border-radius: 999px;
  background: var(--chip-color);
}

.segment.active,
.chip.active,
.chapter-button.active,
.segment:hover,
.chip:hover,
.chapter-button:hover {
  background: rgba(201, 143, 88, 0.14);
  border-color: rgba(201, 143, 88, 0.44);
  transform: translateY(-1px);
}

@media (max-width: 760px) {
  .controls {
    max-width: none;
    padding: 1rem;
  }

  .title {
    max-width: 12ch;
    font-size: clamp(2rem, 13vw, 3.4rem);
  }
}
</style>
