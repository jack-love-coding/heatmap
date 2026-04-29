export const SOURCE_AUDIO_STATE_EVENT = 'atlas:source-audio-state'

export interface SourceAudioStateDetail {
  active: boolean
  clipId?: string
}

export function dispatchSourceAudioState(detail: SourceAudioStateDetail) {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new CustomEvent<SourceAudioStateDetail>(SOURCE_AUDIO_STATE_EVENT, { detail }))
}
