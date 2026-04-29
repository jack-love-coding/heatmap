import type { Language } from '@/data/ww2MusicAtlas'

export interface ArtistMarker {
  id: string
  countryId: string
  lat: number
  lng: number
  startYear: number
  endYear: number
  nameZh: string
  nameEn: string
  noteZh: string
  noteEn: string
  summaryZh?: string
  summaryEn?: string
  sourceIds?: string[]
  audioClipIds?: string[]
}

export const artistMarkers: ArtistMarker[] = [
  {
    id: 'benny-goodman',
    countryId: 'us',
    lat: 40.71,
    lng: -74.0,
    startYear: 1935,
    endYear: 1941,
    nameZh: '本尼·古德曼',
    nameEn: 'Benny Goodman',
    noteZh: '纽约摇摆乐与大乐队时代的代表人物。',
    noteEn: 'A defining New York figure of the swing and big-band era.',
  },
  {
    id: 'andrews-sisters',
    countryId: 'us',
    lat: 34.05,
    lng: -118.24,
    startYear: 1941,
    endYear: 1945,
    nameZh: '安德鲁斯姐妹',
    nameEn: 'The Andrews Sisters',
    noteZh: '战时娱乐系统中最具传播力的美国女声组合之一。',
    noteEn: 'One of the most widely circulated female groups in the U.S. wartime entertainment system.',
  },
  {
    id: 'vera-lynn',
    countryId: 'uk',
    lat: 51.5,
    lng: -0.12,
    startYear: 1939,
    endYear: 1945,
    nameZh: '薇拉·琳恩',
    nameEn: 'Vera Lynn',
    noteZh: '伦敦战时广播与慰问演出的象征性声音。',
    noteEn: 'An emblematic voice of London wartime broadcasting and morale performances.',
  },
  {
    id: 'kurt-weill',
    countryId: 'de',
    lat: 52.52,
    lng: 13.4,
    startYear: 1931,
    endYear: 1933,
    nameZh: '库尔特·魏尔',
    nameEn: 'Kurt Weill',
    noteZh: '魏玛余波中最重要的都市音乐与剧场作曲家之一。',
    noteEn: 'One of the key urban music and theatre composers of the late Weimar moment.',
  },
  {
    id: 'lale-andersen',
    countryId: 'de',
    lat: 53.55,
    lng: 9.99,
    startYear: 1940,
    endYear: 1945,
    nameZh: '拉蕾·安德森',
    nameEn: 'Lale Andersen',
    noteZh: '《莉莉玛莲》让她成为横跨前线的战时声音。',
    noteEn: '“Lili Marleen” made her a wartime voice heard across multiple fronts.',
  },
  {
    id: 'klavdiya-shulzhenko',
    countryId: 'su',
    lat: 59.93,
    lng: 30.33,
    startYear: 1941,
    endYear: 1945,
    nameZh: '克拉夫季娅·舒尔任科',
    nameEn: 'Klavdiya Shulzhenko',
    noteZh: '列宁格勒与前线歌曲传统中的标志性歌者。',
    noteEn: 'A defining singer of Leningrad and frontline song culture.',
  },
  {
    id: 'edith-piaf',
    countryId: 'fr',
    lat: 48.86,
    lng: 2.35,
    startYear: 1940,
    endYear: 1949,
    nameZh: '艾迪特·琵雅芙',
    nameEn: 'Edith Piaf',
    noteZh: '占领与解放之后巴黎香颂最具代表性的声音。',
    noteEn: 'One of the defining chanson voices of occupied and liberated Paris.',
  },
  {
    id: 'django-reinhardt',
    countryId: 'fr',
    lat: 48.86,
    lng: 2.29,
    startYear: 1935,
    endYear: 1946,
    nameZh: '姜戈·莱因哈特',
    nameEn: 'Django Reinhardt',
    noteZh: '巴黎俱乐部爵士与吉普赛爵士的重要象征。',
    noteEn: 'A central symbol of Paris club jazz and gypsy jazz.',
  },
  {
    id: 'carlo-buti',
    countryId: 'it',
    lat: 43.77,
    lng: 11.25,
    startYear: 1931,
    endYear: 1940,
    nameZh: '卡洛·布蒂',
    nameEn: 'Carlo Buti',
    noteZh: '广播时代前期意大利抒情流行歌曲代表。',
    noteEn: 'An early radio-era representative of Italian lyrical popular song.',
  },
  {
    id: 'nilla-pizzi',
    countryId: 'it',
    lat: 45.46,
    lng: 9.19,
    startYear: 1946,
    endYear: 1949,
    nameZh: '尼拉·皮齐',
    nameEn: 'Nilla Pizzi',
    noteZh: '战后大众歌谣与节庆型流行风格的重要人物。',
    noteEn: 'A major figure in postwar popular ballads and festival-oriented pop.',
  },
  {
    id: 'noriko-awaya',
    countryId: 'jp',
    lat: 35.68,
    lng: 139.76,
    startYear: 1933,
    endYear: 1943,
    nameZh: '淡谷纪子',
    nameEn: 'Noriko Awaya',
    noteZh: '战前都会流行歌与电影歌曲的重要都会女声。',
    noteEn: 'A major urban female voice of prewar popular and film song.',
  },
  {
    id: 'shizuko-kasagi',
    countryId: 'jp',
    lat: 34.69,
    lng: 135.5,
    startYear: 1946,
    endYear: 1949,
    nameZh: '笠置静子',
    nameEn: 'Shizuko Kasagi',
    noteZh: '战后布吉与都市娱乐回潮的代表歌手。',
    noteEn: 'A defining singer of postwar boogie and urban entertainment revival.',
  },
  {
    id: 'zhou-xuan',
    countryId: 'cn',
    lat: 31.23,
    lng: 121.47,
    startYear: 1934,
    endYear: 1946,
    nameZh: '周璇',
    nameEn: 'Zhou Xuan',
    noteZh: '上海时代曲、电影歌曲与都市录音文化的核心人物。',
    noteEn: 'A central figure in Shanghai popular song, film music, and urban recording culture.',
  },
  {
    id: 'xian-xinghai',
    countryId: 'cn',
    lat: 29.56,
    lng: 106.55,
    startYear: 1938,
    endYear: 1945,
    nameZh: '冼星海',
    nameEn: 'Xian Xinghai',
    noteZh: '抗战时期大型合唱与民族动员音乐的核心作曲家。',
    noteEn: 'A core composer of wartime choral works and national mobilization music.',
  },
]

export function getArtistName(artist: ArtistMarker, language: Language) {
  return language === 'zh' ? artist.nameZh : artist.nameEn
}

export function getArtistNote(artist: ArtistMarker, language: Language) {
  return language === 'zh' ? artist.noteZh : artist.noteEn
}
