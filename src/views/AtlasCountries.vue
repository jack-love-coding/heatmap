<script setup lang="ts">
import { navigateTo } from '@/router'
import { useAtlasState } from '@/composables/useAtlasState'
import { getCountryName, getStyleName, getStyleSummary } from '@/lib/atlas'

const atlas = useAtlasState()

function openSources() {
  navigateTo({
    path: '/sources',
    query: {
      year: atlas.activeYear.value,
      event: atlas.selectedEventId.value,
      countries: atlas.selectedCountryIds.value.join(','),
      lang: atlas.language.value,
    },
  })
}
</script>

<template>
  <main class="archive-page countries-page">
    <aside class="route-sidebar">
      <p class="kicker">{{ atlas.language.value === 'zh' ? '国家对比' : 'Country Compare' }}</p>
      <h1>{{ atlas.language.value === 'zh' ? '国家风格' : 'Country Styles' }}</h1>
      <p>
        {{
          atlas.language.value === 'zh'
            ? '选择一到两个国家，比较同一年份下的音乐风格、关键词与代表作品。'
            : 'Select one or two countries to compare style phases, keywords, artists, and works for the active year.'
        }}
      </p>
      <div class="country-picker">
        <button
          v-for="country in atlas.countries"
          :key="country.id"
          type="button"
          :class="{ active: atlas.selectedCountryIds.value.includes(country.id) }"
          @click="atlas.setMode('explore'); atlas.toggleCountry(country.id)"
        >
          <span :style="{ '--swatch': country.color }" />
          {{ getCountryName(country, atlas.language.value) }}
        </button>
      </div>
      <label class="year-control">
        <span>{{ atlas.activeYear.value }}</span>
        <input
          type="range"
          min="1931"
          max="1949"
          :value="atlas.activeYear.value"
          @input="atlas.setYear(Number(($event.target as HTMLInputElement).value))"
        >
      </label>
    </aside>

    <section class="country-grid" data-testid="compare-panel">
      <article v-for="item in atlas.countryDetails.value" :key="item.country.id" class="country-surface">
        <p class="kicker">{{ getCountryName(item.country, atlas.language.value) }}</p>
        <template v-if="item.phase">
          <h2>{{ getStyleName(item.phase, atlas.language.value) }}</h2>
          <p>{{ getStyleSummary(item.phase, atlas.language.value) }}</p>
          <div class="metadata-grid">
            <section>
              <h3>{{ atlas.language.value === 'zh' ? '关键词' : 'Keywords' }}</h3>
              <p>{{ item.phase.keywords.join(' / ') }}</p>
            </section>
            <section>
              <h3>{{ atlas.language.value === 'zh' ? '代表人物' : 'Representative Artists' }}</h3>
              <p>{{ item.phase.representativeArtists.join(' / ') }}</p>
            </section>
            <section>
              <h3>{{ atlas.language.value === 'zh' ? '代表作品' : 'Representative Works' }}</h3>
              <p>{{ item.phase.representativeWorks.join(' / ') }}</p>
            </section>
          </div>
        </template>
      </article>

      <div class="sources-cta">
        <p>{{ atlas.language.value === 'zh' ? '需要查看出处和音频记录？' : 'Need the archive trail and audio records?' }}</p>
        <button type="button" @click="openSources">
          {{ atlas.language.value === 'zh' ? '打开档案资料' : 'Open Sources' }}
        </button>
      </div>
    </section>
  </main>
</template>

<style scoped>
.archive-page {
  min-height: 100vh;
  display: grid;
  grid-template-columns: minmax(18rem, 24rem) 1fr;
  gap: 1rem;
  padding: 6.4rem 1rem 1rem;
}

.route-sidebar,
.country-surface,
.sources-cta {
  background: rgba(10, 15, 21, 0.72);
  border: 1px solid rgba(239, 228, 208, 0.1);
  backdrop-filter: blur(16px);
}

.route-sidebar {
  align-self: start;
  display: grid;
  gap: 1rem;
  padding: 1rem;
}

.kicker {
  margin: 0;
  color: var(--atlas-accent);
  font-size: 0.72rem;
  letter-spacing: 0.22em;
  text-transform: uppercase;
}

h1,
h2 {
  margin: 0;
  font-family: Georgia, 'Times New Roman', 'Noto Serif SC', serif;
  line-height: 1;
}

h1 {
  font-size: clamp(2.1rem, 4vw, 4rem);
}

h2 {
  font-size: clamp(1.6rem, 3vw, 3rem);
}

h3 {
  margin: 0;
  color: rgba(239, 228, 208, 0.6);
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  text-transform: uppercase;
}

p {
  margin: 0;
  color: var(--atlas-muted);
  line-height: 1.62;
}

.country-picker {
  display: grid;
  gap: 0.45rem;
}

.country-picker button,
.sources-cta button {
  border: 1px solid rgba(239, 228, 208, 0.1);
  background: rgba(255, 255, 255, 0.035);
  color: var(--atlas-text);
  cursor: pointer;
}

.country-picker button {
  display: inline-flex;
  gap: 0.55rem;
  align-items: center;
  padding: 0.65rem 0.75rem;
  text-align: left;
}

.country-picker button.active {
  background: rgba(201, 143, 88, 0.14);
  border-color: rgba(201, 143, 88, 0.38);
}

.country-picker span {
  width: 0.7rem;
  height: 0.7rem;
  border-radius: 999px;
  background: var(--swatch);
}

.year-control {
  display: grid;
  gap: 0.35rem;
}

.year-control span {
  font-family: Georgia, 'Times New Roman', 'Noto Serif SC', serif;
  font-size: 2rem;
}

.country-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  align-content: start;
}

.country-surface {
  display: grid;
  gap: 1rem;
  min-height: 28rem;
  padding: 1.25rem;
}

.metadata-grid {
  display: grid;
  gap: 0.9rem;
  margin-top: 0.4rem;
}

.metadata-grid section {
  display: grid;
  gap: 0.35rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(239, 228, 208, 0.08);
}

.sources-cta {
  grid-column: 1 / -1;
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 1rem;
}

.sources-cta button {
  padding: 0.68rem 0.9rem;
}

@media (max-width: 900px) {
  .archive-page,
  .country-grid {
    grid-template-columns: 1fr;
  }

  .archive-page {
    padding-top: 12rem;
  }

  .country-surface {
    min-height: auto;
  }
}
</style>
