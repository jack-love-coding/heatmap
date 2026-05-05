import { publicAssetPath } from '@/lib/publicAssets'

export type Language = 'zh' | 'en'
export type AtlasMode = 'story' | 'explore'
export type LayerKey = 'styles' | 'events' | 'influence'

export interface CountryProfile {
  id: string
  nameZh: string
  nameEn: string
  lat: number
  lng: number
  region: string
  color: string
}

export interface StylePhase {
  countryId: string
  startYear: number
  endYear: number
  styleNameZh: string
  styleNameEn: string
  keywords: string[]
  summaryZh: string
  summaryEn: string
  representativeWorks: string[]
  representativeArtists: string[]
  sourceIds?: string[]
  audioClipIds?: string[]
}

export interface GlobeFocus {
  lat: number
  lng: number
  altitude: number
}

export interface EventImage {
  src: string
  altZh: string
  altEn: string
  credit: string
  sourceUrl: string
  licenseLabel: string
  licenseUrl?: string
  generated: boolean
}

export interface RelatedSong {
  title: string
  performer: string
  year: string
  noteZh: string
  noteEn: string
  sourceUrl: string
  streamUrl?: string
  rightsLabel: string
  rightsUrl?: string
}

export interface HistoricEvent {
  id: string
  year: number
  titleZh: string
  titleEn: string
  descriptionZh: string
  descriptionEn: string
  longDescriptionZh?: string
  longDescriptionEn?: string
  musicImpactZh?: string
  musicImpactEn?: string
  relatedSongs?: RelatedSong[]
  image?: EventImage
  affectedCountryIds: string[]
  category: 'policy' | 'conflict' | 'broadcast' | 'occupation' | 'liberation' | 'reconstruction'
  globeFocus: GlobeFocus
  sourceIds?: string[]
  audioClipIds?: string[]
}

export interface SourceReference {
  id: string
  title: string
  archiveOrAuthor: string
  year: string
  url: string
  kind: SourceKind
  isPrimary: boolean
  noteZh: string
  noteEn: string
}

export type SourceKind =
  | 'archive'
  | 'biography'
  | 'history'
  | 'study'
  | 'museum'
  | 'recording'
  | 'overview'
  | 'essay'
  | 'foundation'

export interface AudioClip {
  id: string
  title: string
  performer: string
  year: string
  recordUrl: string
  streamUrl?: string
  rightsLabel: string
  rightsUrl?: string
  noteZh: string
  noteEn: string
}

export type BackgroundTrackSensitivity = 'neutral' | 'patriotic' | 'sensitive-context'

export interface BackgroundTrack {
  id: string
  titleZh: string
  titleEn: string
  countryId?: string
  yearLabel: string
  src: string
  sourceUrl: string
  licenseLabel: string
  licenseUrl?: string
  credit: string
  noteZh: string
  noteEn: string
  sensitivity: BackgroundTrackSensitivity
}

export interface BibliographySection {
  id: string
  titleZh: string
  titleEn: string
  descriptionZh: string
  descriptionEn: string
  sourceIds: string[]
}

export interface InfluenceArc {
  sourceCountryId: string
  targetCountryId: string
  startYear: number
  endYear: number
  reasonZh: string
  reasonEn: string
  weight: number
}

export type ChapterEvidenceKind = 'historical-trigger' | 'music-mechanism' | 'audible-evidence'

export interface ChapterEvidencePoint {
  kind: ChapterEvidenceKind
  labelZh: string
  labelEn: string
  titleZh: string
  titleEn: string
  bodyZh: string
  bodyEn: string
}

export interface ChapterScene {
  id: string
  titleZh: string
  titleEn: string
  summaryZh: string
  summaryEn: string
  detailZh: string
  detailEn: string
  evidencePoints: ChapterEvidencePoint[]
  thumbnail: EventImage
  yearRange: [number, number]
  focusCountryIds: string[]
  focusEventIds: string[]
  cameraPose: GlobeFocus
}

export const YEAR_MIN = 1931
export const YEAR_MAX = 1949

function generatedChapterImage(src: string, altZh: string, altEn: string): EventImage {
  return {
    src: publicAssetPath(src),
    altZh,
    altEn,
    credit: 'Generated with OpenAI image generation for this project',
    sourceUrl: `generated:imagegen:${src.replace(/^\/images\/generated\/|\.png$/g, '')}`,
    licenseLabel: 'Generated project asset; not a historical photograph',
    generated: true,
  }
}

export const countries: CountryProfile[] = [
  { id: 'us', nameZh: '美国', nameEn: 'United States', lat: 38.9, lng: -77.0, region: 'North America', color: '#c98f58' },
  { id: 'uk', nameZh: '英国', nameEn: 'United Kingdom', lat: 51.5, lng: -0.1, region: 'Europe', color: '#94b4c7' },
  { id: 'de', nameZh: '德国', nameEn: 'Germany', lat: 52.5, lng: 13.4, region: 'Europe', color: '#d0674d' },
  { id: 'su', nameZh: '苏联', nameEn: 'Soviet Union', lat: 55.7, lng: 37.6, region: 'Eurasia', color: '#cb8350' },
  { id: 'fr', nameZh: '法国', nameEn: 'France', lat: 48.9, lng: 2.3, region: 'Europe', color: '#8aa58d' },
  { id: 'it', nameZh: '意大利', nameEn: 'Italy', lat: 41.9, lng: 12.5, region: 'Europe', color: '#a67c52' },
  { id: 'jp', nameZh: '日本', nameEn: 'Japan', lat: 35.7, lng: 139.7, region: 'East Asia', color: '#b66b68' },
  { id: 'cn', nameZh: '中国', nameEn: 'China', lat: 39.9, lng: 116.4, region: 'East Asia', color: '#ba9457' },
]

export const stylePhases: StylePhase[] = [
  {
    countryId: 'us',
    startYear: 1931,
    endYear: 1938,
    styleNameZh: '大乐队与新政广播',
    styleNameEn: 'Big Band and New Deal Broadcasting',
    keywords: ['swing', 'radio', 'dance halls'],
    summaryZh: '商业电台与舞厅文化让摇摆乐成为全国性的现代声音，音乐同时承担慰藉经济萧条的公共情绪。',
    summaryEn: 'Commercial radio and dance halls turned swing into a national modern sound, while music also helped absorb the emotional strain of the Depression.',
    representativeWorks: ['In the Mood', 'Sing, Sing, Sing'],
    representativeArtists: ['Glenn Miller', 'Benny Goodman'],
  },
  {
    countryId: 'us',
    startYear: 1939,
    endYear: 1945,
    styleNameZh: '战时娱乐与军队传播',
    styleNameEn: 'Wartime Entertainment and Military Circulation',
    keywords: ['USO', 'broadcast', 'morale'],
    summaryZh: '军队文工网络与短波广播把爵士、流行歌和抒情歌曲带向全球，也让美国声音与盟军宣传深度绑定。',
    summaryEn: 'Military entertainment circuits and shortwave broadcasts pushed jazz and popular song worldwide, linking the American sound to Allied morale and messaging.',
    representativeWorks: ['Boogie Woogie Bugle Boy', "I'll Be Seeing You"],
    representativeArtists: ['The Andrews Sisters', 'Bing Crosby'],
  },
  {
    countryId: 'us',
    startYear: 1946,
    endYear: 1949,
    styleNameZh: '战后跨大西洋流行扩散',
    styleNameEn: 'Postwar Transatlantic Popular Expansion',
    keywords: ['crooners', 'bebop', 'records'],
    summaryZh: '唱片工业与驻军文化推动美国流行乐、比波普与音乐产业模式在欧洲和日本形成新模板。',
    summaryEn: 'The record business and military presence helped American pop, bebop, and industrial music practices become templates in Europe and Japan.',
    representativeWorks: ['Move', 'Nature Boy'],
    representativeArtists: ['Dizzy Gillespie', 'Nat King Cole'],
  },
  {
    countryId: 'uk',
    startYear: 1931,
    endYear: 1938,
    styleNameZh: '舞厅乐队与帝国广播',
    styleNameEn: 'Dance Bands and Imperial Broadcasting',
    keywords: ['BBC', 'dance band', 'light music'],
    summaryZh: 'BBC 的规范化播出让轻音乐、舞厅乐队与帝国联播形成保守而高效的主流声景。',
    summaryEn: 'The BBC’s disciplined programming made light music, dance bands, and imperial relay broadcasting a conservative yet efficient mainstream soundscape.',
    representativeWorks: ['The Very Thought of You', 'The Lambeth Walk'],
    representativeArtists: ['Al Bowlly', 'Ambrose'],
  },
  {
    countryId: 'uk',
    startYear: 1939,
    endYear: 1945,
    styleNameZh: '闪电战时期的韧性广播',
    styleNameEn: 'Blitz-Era Resilience Broadcasting',
    keywords: ['BBC Forces', 'morale', 'community singing'],
    summaryZh: '战时节目将歌舞厅传统转化为韧性叙事，广播成为防空洞、工厂与前线共同的声音纽带。',
    summaryEn: 'Wartime programming turned music hall traditions into a narrative of resilience, with radio linking shelters, factories, and the front.',
    representativeWorks: ["We'll Meet Again", 'The White Cliffs of Dover'],
    representativeArtists: ['Vera Lynn', 'Gracie Fields'],
  },
  {
    countryId: 'uk',
    startYear: 1946,
    endYear: 1949,
    styleNameZh: '节后复苏与美式接触',
    styleNameEn: 'Austerity Recovery and American Contact',
    keywords: ['swing', 'skiffle seeds', 'youth culture'],
    summaryZh: '紧缩年代中，英国乐坛吸收驻英美军与唱片输入，为战后青年流行文化奠定土壤。',
    summaryEn: 'Under austerity, British music absorbed American troop culture and record imports, setting groundwork for postwar youth pop.',
    representativeWorks: ['A Nightingale Sang in Berkeley Square', 'Buttons and Bows'],
    representativeArtists: ['Anne Shelton', 'Ted Heath'],
  },
  {
    countryId: 'de',
    startYear: 1931,
    endYear: 1935,
    styleNameZh: '魏玛余波与文化清洗',
    styleNameEn: 'Weimar Echoes and Cultural Purge',
    keywords: ['cabaret', 'ban', 'state control'],
    summaryZh: '魏玛时期的歌舞厅、爵士与实验音乐很快遭遇国家主义审查，音乐空间被重新政治化。',
    summaryEn: 'Cabaret, jazz, and experimental music from the Weimar era rapidly faced nationalist censorship as musical space was repoliticized.',
    representativeWorks: ['Mack the Knife', 'Falling in Love Again'],
    representativeArtists: ['Marlene Dietrich', 'Kurt Weill'],
  },
  {
    countryId: 'de',
    startYear: 1936,
    endYear: 1943,
    styleNameZh: '宣传编制与受控娱乐',
    styleNameEn: 'Propaganda Programming and Controlled Entertainment',
    keywords: ['march', 'radio orchestra', 'approved swing'],
    summaryZh: '纳粹体制既压制“堕落音乐”，也保留经过筛选的轻音乐与舞曲，以维持秩序和动员效果。',
    summaryEn: 'The Nazi system suppressed “degenerate music” while preserving filtered light music and dance tunes to sustain order and mobilization.',
    representativeWorks: ['Lili Marleen', 'Wunschkonzert themes'],
    representativeArtists: ['Zarah Leander', 'Lale Andersen'],
  },
  {
    countryId: 'de',
    startYear: 1944,
    endYear: 1949,
    styleNameZh: '废墟中的再定向',
    styleNameEn: 'Reorientation in the Ruins',
    keywords: ['occupation radio', 'denazification', 'jazz return'],
    summaryZh: '战败后，占领区电台与文化重建让爵士、室内乐和新公共广播成为重新定义德国音乐身份的渠道。',
    summaryEn: 'After defeat, occupation radio and cultural reconstruction reopened jazz, chamber music, and public broadcasting as channels for a new musical identity.',
    representativeWorks: ['In jenen Tagen', 'Rundfunk Tanzorchester'],
    representativeArtists: ['Wolfgang Langhoff', 'Horst Winter'],
  },
  {
    countryId: 'su',
    startYear: 1931,
    endYear: 1938,
    styleNameZh: '社会主义现实主义定型',
    styleNameEn: 'Socialist Realist Consolidation',
    keywords: ['mass song', 'state ensembles', 'folk symphonism'],
    summaryZh: '国家主导的合唱、群众歌曲与民间改编共同塑造了可传播、可动员的苏联声响模型。',
    summaryEn: 'State-led choral works, mass songs, and arranged folk idioms shaped a Soviet sonic model built for circulation and mobilization.',
    representativeWorks: ['Song of the Motherland', 'Polyushko Pole'],
    representativeArtists: ['Isaak Dunaevsky', 'Alexandrov Ensemble'],
  },
  {
    countryId: 'su',
    startYear: 1939,
    endYear: 1945,
    styleNameZh: '卫国战争歌曲传统',
    styleNameEn: 'Great Patriotic War Song Tradition',
    keywords: ['front songs', 'choral patriotism', 'film music'],
    summaryZh: '前线歌曲、电影配乐和大型合唱成为集体牺牲与祖国叙事的核心媒介。',
    summaryEn: 'Frontline songs, film scores, and massed choirs became the core media for sacrifice and homeland narratives.',
    representativeWorks: ['Katyusha', 'Sacred War'],
    representativeArtists: ['Klavdiya Shulzhenko', 'Red Army Choir'],
  },
  {
    countryId: 'su',
    startYear: 1946,
    endYear: 1949,
    styleNameZh: '胜利庆典与冷战调门',
    styleNameEn: 'Victory Pageantry and Cold War Tone',
    keywords: ['official festivals', 'heroic song', 'doctrine'],
    summaryZh: '战后胜利叙事延续了英雄化音乐语言，也为随后的意识形态收紧打下基调。',
    summaryEn: 'Postwar victory narratives preserved heroic musical language and laid the tone for later ideological tightening.',
    representativeWorks: ['March of the Enthusiasts', 'Victory Day cantatas'],
    representativeArtists: ['Tikhon Khrennikov', 'Lyudmila Zykina'],
  },
  {
    countryId: 'fr',
    startYear: 1931,
    endYear: 1938,
    styleNameZh: '都市香颂与左岸实验',
    styleNameEn: 'Urban Chanson and Left Bank Experiment',
    keywords: ['chanson', 'cabaret', 'jazz clubs'],
    summaryZh: '巴黎在战前仍保持歌舞厅、香颂和跨大西洋爵士俱乐部并存的多声部景观。',
    summaryEn: 'Prewar Paris remained a polyphonic scene where cabaret, chanson, and transatlantic jazz clubs coexisted.',
    representativeWorks: ['Parlez-moi d’amour', 'J’attendrai'],
    representativeArtists: ['Lucienne Boyer', 'Django Reinhardt'],
  },
  {
    countryId: 'fr',
    startYear: 1939,
    endYear: 1944,
    styleNameZh: '占领时期的隐喻与生存',
    styleNameEn: 'Occupation-Era Metaphor and Survival',
    keywords: ['coded lyrics', 'cafe music', 'resistance'],
    summaryZh: '在审查和占领下，香颂以暧昧隐喻和城市私密性保存文化连续性，也成为抵抗想象的一部分。',
    summaryEn: 'Under censorship and occupation, chanson preserved continuity through ambiguity and urban intimacy, feeding resistance imaginaries.',
    representativeWorks: ['La Vie en rose', 'Nuages'],
    representativeArtists: ['Edith Piaf', 'Django Reinhardt'],
  },
  {
    countryId: 'fr',
    startYear: 1945,
    endYear: 1949,
    styleNameZh: '解放后的新巴黎声景',
    styleNameEn: 'Post-Liberation Paris Soundscape',
    keywords: ['jazz revival', 'cabaret return', 'existential clubs'],
    summaryZh: '解放后的巴黎吸纳盟军爵士和本土香颂，形成更开放也更国际化的夜生活音乐文化。',
    summaryEn: 'After liberation, Paris merged Allied jazz with chanson into a more open and international nightlife culture.',
    representativeWorks: ['Les feuilles mortes', 'C’est si bon'],
    representativeArtists: ['Yves Montand', 'Juliette Greco'],
  },
  {
    countryId: 'it',
    startYear: 1931,
    endYear: 1938,
    styleNameZh: '法西斯仪式与轻歌剧余温',
    styleNameEn: 'Fascist Ceremony and Operetta Echoes',
    keywords: ['marches', 'EIAR', 'operetta'],
    summaryZh: '国家仪式、广播网络与轻歌剧传统共存，形成兼具威权秩序与都市娱乐的双重声音。',
    summaryEn: 'State ceremony, radio networks, and operetta traditions coexisted in a soundscape split between authoritarian order and urban entertainment.',
    representativeWorks: ['Faccetta Nera', 'Parlami d’amore Mariu'],
    representativeArtists: ['Carlo Buti', 'Beniamino Gigli'],
  },
  {
    countryId: 'it',
    startYear: 1939,
    endYear: 1945,
    styleNameZh: '战时广播与地方韧性',
    styleNameEn: 'Wartime Broadcasting and Local Resilience',
    keywords: ['radio', 'regional songs', 'survival'],
    summaryZh: '随着战争压力加深，意大利音乐从官方广播转向更碎片化的地方性和生存性表达。',
    summaryEn: 'As wartime pressure intensified, Italian music shifted from official broadcasts toward more fractured regional and survival-based expression.',
    representativeWorks: ['Voglio vivere cosi', 'Ma l’amore no'],
    representativeArtists: ['Lina Termini', 'Quartetto Cetra'],
  },
  {
    countryId: 'it',
    startYear: 1946,
    endYear: 1949,
    styleNameZh: '电影歌谣与大众重建',
    styleNameEn: 'Cinematic Ballads and Popular Reconstruction',
    keywords: ['neorealism', 'festival culture', 'crooners'],
    summaryZh: '战后电影、流行歌手与广播节目录制推动意大利从官方仪式声转向大众抒情流行。',
    summaryEn: 'Postwar cinema, popular singers, and broadcast recording shifted Italy from ceremonial sound toward mass lyrical pop.',
    representativeWorks: ['Torna a Surriento', 'Vola colomba'],
    representativeArtists: ['Nilla Pizzi', 'Natalino Otto'],
  },
  {
    countryId: 'jp',
    startYear: 1931,
    endYear: 1937,
    styleNameZh: '都会流行与帝国扩张前夜',
    styleNameEn: 'Urban Ryuko-ka before Imperial Expansion',
    keywords: ['ryuko-ka', 'film songs', 'dance music'],
    summaryZh: '战前日本流行歌与电影歌曲高度都市化，但已开始在广播与检阅文化中被重新编码。',
    summaryEn: 'Prewar Japanese popular song and film music were highly urban, yet increasingly recoded through broadcasting and inspection culture.',
    representativeWorks: ['Tokyo Rhapsody', 'Wakare no Blues'],
    representativeArtists: ['Ichiro Fujiyama', 'Noriko Awaya'],
  },
  {
    countryId: 'jp',
    startYear: 1938,
    endYear: 1945,
    styleNameZh: '国策歌谣与情绪管理',
    styleNameEn: 'National Policy Songs and Emotional Management',
    keywords: ['gunka', 'radio discipline', 'state songs'],
    summaryZh: '战时体制下，国策歌谣、军歌和情绪抚慰型歌曲共同服务于动员与秩序维护。',
    summaryEn: 'Under wartime control, policy songs, military songs, and emotionally soothing tunes all served mobilization and social order.',
    representativeWorks: ['Aikoku Koshinkyoku', 'Umi Yukaba'],
    representativeArtists: ['Bin Uehara', 'Yoshiko Yamaguchi'],
  },
  {
    countryId: 'jp',
    startYear: 1946,
    endYear: 1949,
    styleNameZh: '占领期再流行化',
    styleNameEn: 'Occupation-Era Repopularization',
    keywords: ['jazz bars', 'boogie-woogie', 'occupation radio'],
    summaryZh: '占领军广播和夜总会带回爵士与布吉，旧流行歌体系被快速重组为战后都市娱乐。',
    summaryEn: 'Occupation radio and nightlife brought jazz and boogie back, rapidly reorganizing prewar pop into postwar urban entertainment.',
    representativeWorks: ['Tokyo Boogie-Woogie', 'Ringo no Uta'],
    representativeArtists: ['Hibari Misora', 'Shizuko Kasagi'],
  },
  {
    countryId: 'cn',
    startYear: 1931,
    endYear: 1936,
    styleNameZh: '上海时代曲与都会录音',
    styleNameEn: 'Shanghai Shidaiqu and Urban Recording',
    keywords: ['shidaiqu', 'gramophone', 'film songs'],
    summaryZh: '上海的唱片工业、电影公司和夜总会共同塑造了战前东亚最现代的流行声音。',
    summaryEn: 'Shanghai’s record industry, studios, and dance halls shaped one of East Asia’s most modern prewar popular sounds.',
    representativeWorks: ['夜来香', '天涯歌女'],
    representativeArtists: ['周璇', '黎锦晖'],
  },
  {
    countryId: 'cn',
    startYear: 1937,
    endYear: 1945,
    styleNameZh: '抗战歌曲与民族动员',
    styleNameEn: 'Resistance Songs and National Mobilization',
    keywords: ['mass songs', 'choral movement', 'migration'],
    summaryZh: '战争使音乐中心西移，抗战歌曲、合唱运动和流亡创作成为音乐生产的主轴。',
    summaryEn: 'War shifted musical centers inland, making resistance songs, choral movements, and displaced creativity the main axis of production.',
    representativeWorks: ['义勇军进行曲', '黄河大合唱'],
    representativeArtists: ['聂耳', '冼星海'],
  },
  {
    countryId: 'cn',
    startYear: 1946,
    endYear: 1949,
    styleNameZh: '重建、分流与新国家声部',
    styleNameEn: 'Reconstruction, Fragmentation, and New State Voice',
    keywords: ['broadcast', 'regional split', 'mass chorus'],
    summaryZh: '战后重建与政治分化让电影歌曲、广播歌曲和群众音乐并行，新的国家声音正在形成。',
    summaryEn: 'Reconstruction and political fragmentation made film songs, radio songs, and mass music coexist as a new state sound began to form.',
    representativeWorks: ['我的祖国', '渔光曲'],
    representativeArtists: ['白光', '郭兰英'],
  },
]

export const historicEvents: HistoricEvent[] = [
  {
    id: 'mukden-incident',
    year: 1931,
    titleZh: '九一八事变',
    titleEn: 'Mukden Incident',
    descriptionZh: '日本在中国东北的扩张改变了东亚音乐传播中心，战时宣传与流亡创作逐步取代了纯都会娱乐。',
    descriptionEn: 'Japanese expansion in Northeast China shifted East Asian musical centers, gradually replacing purely urban entertainment with propaganda and displaced creation.',
    affectedCountryIds: ['jp', 'cn'],
    category: 'conflict',
    globeFocus: { lat: 41.8, lng: 123.4, altitude: 1.9 },
  },
  {
    id: 'reich-chamber',
    year: 1933,
    titleZh: '帝国文化院整编',
    titleEn: 'Reich Chamber of Culture',
    descriptionZh: '纳粹文化机构将音乐生产纳入国家审批，魏玛时期的爵士、卡巴莱与实验传统迅速被边缘化。',
    descriptionEn: 'Nazi cultural institutions folded music production into state approval, pushing Weimar jazz, cabaret, and experiment rapidly to the margins.',
    affectedCountryIds: ['de'],
    category: 'policy',
    globeFocus: { lat: 52.5, lng: 13.4, altitude: 1.75 },
  },
  {
    id: 'rome-berlin-axis',
    year: 1936,
    titleZh: '罗马-柏林轴心形成',
    titleEn: 'Rome-Berlin Axis',
    descriptionZh: '轴心国政治整合强化了官方仪式音乐、广播管控与跨国宣传节奏的同步化。',
    descriptionEn: 'Axis coordination strengthened official ceremonial music, broadcast control, and synchronized propaganda rhythms across borders.',
    affectedCountryIds: ['de', 'it'],
    category: 'policy',
    globeFocus: { lat: 46.8, lng: 11.0, altitude: 2.0 },
  },
  {
    id: 'second-sino-japanese-war',
    year: 1937,
    titleZh: '全面侵华战争爆发',
    titleEn: 'Second Sino-Japanese War',
    descriptionZh: '上海流行工业被迫转移，中国音乐转向抗战歌曲和合唱，日本则进一步强化国策歌谣。',
    descriptionEn: 'Shanghai’s popular industry was forced inland as Chinese music shifted toward resistance songs, while Japan intensified policy songs.',
    affectedCountryIds: ['jp', 'cn'],
    category: 'conflict',
    globeFocus: { lat: 31.2, lng: 121.5, altitude: 1.9 },
  },
  {
    id: 'europe-war',
    year: 1939,
    titleZh: '欧洲战争爆发',
    titleEn: 'War Breaks Out in Europe',
    descriptionZh: '广播从娱乐介质转为全民动员工具，英法德意的音乐生产都被卷入战时节奏。',
    descriptionEn: 'Radio shifted from entertainment medium to total mobilization tool, pulling British, French, German, and Italian music into wartime rhythm.',
    affectedCountryIds: ['uk', 'fr', 'de', 'it'],
    category: 'broadcast',
    globeFocus: { lat: 50.7, lng: 6.8, altitude: 2.15 },
  },
  {
    id: 'barbarossa',
    year: 1941,
    titleZh: '巴巴罗萨行动',
    titleEn: 'Operation Barbarossa',
    descriptionZh: '东线战争放大了苏德两侧的爱国歌曲、军队合唱与宣传电影音乐规模。',
    descriptionEn: 'The Eastern Front expanded patriotic songs, army choirs, and propaganda film music on both Soviet and German sides.',
    affectedCountryIds: ['de', 'su'],
    category: 'conflict',
    globeFocus: { lat: 54.5, lng: 28.0, altitude: 2.15 },
  },
  {
    id: 'pearl-harbor',
    year: 1941,
    titleZh: '珍珠港事件',
    titleEn: 'Pearl Harbor',
    descriptionZh: '美国加入战争后，军队娱乐网络与盟军广播让美国流行乐的全球影响急速扩大。',
    descriptionEn: 'After U.S. entry into the war, military entertainment and Allied broadcasting rapidly expanded the global reach of American popular music.',
    affectedCountryIds: ['us', 'jp', 'uk'],
    category: 'broadcast',
    globeFocus: { lat: 21.3, lng: -157.8, altitude: 2.3 },
  },
  {
    id: 'stalingrad',
    year: 1943,
    titleZh: '斯大林格勒转折',
    titleEn: 'Stalingrad Turning Point',
    descriptionZh: '战争拐点使苏联胜利叙事更加高涨，也削弱了德国受控娱乐系统的稳定性。',
    descriptionEn: 'The wartime turning point intensified Soviet victory narratives while destabilizing Germany’s controlled entertainment system.',
    affectedCountryIds: ['su', 'de'],
    category: 'conflict',
    globeFocus: { lat: 48.7, lng: 44.5, altitude: 1.95 },
  },
  {
    id: 'liberation-paris',
    year: 1944,
    titleZh: '巴黎解放',
    titleEn: 'Liberation of Paris',
    descriptionZh: '解放后的巴黎迅速恢复香颂、爵士俱乐部与夜生活，成为盟军文化流动的重要节点。',
    descriptionEn: 'Liberated Paris quickly revived chanson, jazz clubs, and nightlife, becoming a key node in Allied cultural circulation.',
    affectedCountryIds: ['fr', 'us', 'uk'],
    category: 'liberation',
    globeFocus: { lat: 48.9, lng: 2.3, altitude: 1.8 },
  },
  {
    id: 'germany-surrender',
    year: 1945,
    titleZh: '德国投降',
    titleEn: 'German Surrender',
    descriptionZh: '德国战败带来去纳粹化广播与文化重建，欧洲音乐版图也开始围绕美苏影响重新排列。',
    descriptionEn: 'Germany’s defeat brought denazified broadcasting and cultural rebuilding, while Europe’s musical map began to rearrange around U.S. and Soviet influence.',
    affectedCountryIds: ['de', 'fr', 'uk', 'su', 'us', 'it'],
    category: 'reconstruction',
    globeFocus: { lat: 52.5, lng: 13.4, altitude: 1.85 },
  },
  {
    id: 'japan-surrender',
    year: 1945,
    titleZh: '日本投降',
    titleEn: 'Japan Surrenders',
    descriptionZh: '占领期的广播与夜总会文化让日本音乐从国策歌曲快速转入战后流行与爵士混合。',
    descriptionEn: 'Occupation-era broadcasting and nightlife pushed Japanese music rapidly from policy songs toward postwar pop and jazz hybrids.',
    affectedCountryIds: ['jp', 'us', 'cn'],
    category: 'occupation',
    globeFocus: { lat: 35.7, lng: 139.7, altitude: 1.85 },
  },
  {
    id: 'marshall-broadcast',
    year: 1947,
    titleZh: '马歇尔援助与广播现代化',
    titleEn: 'Marshall Aid and Broadcast Modernization',
    descriptionZh: '重建资金、唱片流通与广播更新推动西欧音乐市场加速向美式流行工业靠拢。',
    descriptionEn: 'Reconstruction funding, record circulation, and broadcast renewal pushed Western European music markets toward American popular industry.',
    affectedCountryIds: ['fr', 'it', 'uk', 'us'],
    category: 'reconstruction',
    globeFocus: { lat: 48.0, lng: 7.0, altitude: 2.05 },
  },
  {
    id: 'prc-founding',
    year: 1949,
    titleZh: '中华人民共和国成立',
    titleEn: 'Founding of the PRC',
    descriptionZh: '中国音乐进入新的国家叙事阶段，战时群众歌曲传统开始转化为建国后的公共声音资源。',
    descriptionEn: 'Chinese music entered a new state narrative as wartime mass-song traditions became resources for the post-1949 public sound.',
    affectedCountryIds: ['cn'],
    category: 'reconstruction',
    globeFocus: { lat: 39.9, lng: 116.4, altitude: 1.8 },
  },
]

export const influenceArcs: InfluenceArc[] = [
  {
    sourceCountryId: 'us',
    targetCountryId: 'uk',
    startYear: 1941,
    endYear: 1949,
    reasonZh: '盟军基地、唱片与广播让美国摇摆乐持续输入英国。',
    reasonEn: 'Allied bases, records, and broadcasts kept American swing flowing into Britain.',
    weight: 0.92,
  },
  {
    sourceCountryId: 'us',
    targetCountryId: 'fr',
    startYear: 1944,
    endYear: 1949,
    reasonZh: '解放后的巴黎快速吸收盟军爵士和夜生活文化。',
    reasonEn: 'Post-liberation Paris rapidly absorbed Allied jazz and nightlife culture.',
    weight: 0.86,
  },
  {
    sourceCountryId: 'us',
    targetCountryId: 'jp',
    startYear: 1945,
    endYear: 1949,
    reasonZh: '占领军广播、俱乐部和唱片重塑日本战后流行框架。',
    reasonEn: 'Occupation radio, clubs, and records reshaped Japan’s postwar popular framework.',
    weight: 0.95,
  },
  {
    sourceCountryId: 'su',
    targetCountryId: 'cn',
    startYear: 1945,
    endYear: 1949,
    reasonZh: '群众歌曲与革命合唱的组织逻辑影响中国战后公共音乐书写。',
    reasonEn: 'Mass-song and revolutionary choral organization influenced China’s postwar public music writing.',
    weight: 0.8,
  },
  {
    sourceCountryId: 'de',
    targetCountryId: 'it',
    startYear: 1936,
    endYear: 1943,
    reasonZh: '轴心合作强化了仪式音乐与宣传编排的互通。',
    reasonEn: 'Axis cooperation strengthened exchange in ceremonial music and propaganda programming.',
    weight: 0.68,
  },
  {
    sourceCountryId: 'fr',
    targetCountryId: 'uk',
    startYear: 1931,
    endYear: 1938,
    reasonZh: '巴黎爵士与都市香颂长期影响伦敦舞厅和俱乐部审美。',
    reasonEn: 'Parisian jazz and chanson influenced London dance hall and club taste.',
    weight: 0.56,
  },
]

export const chapterScenes: ChapterScene[] = [
  {
    id: 'chapter-1',
    titleZh: '战前文化张力',
    titleEn: 'Pre-war Cultural Tension',
    summaryZh: '都会流行、国家宣传与电台治理开始在不同国家拉开分野。',
    summaryEn: 'Urban pop, state messaging, and radio governance begin to diverge across countries.',
    detailZh:
      '这一阶段的重点不是全面战争已经爆发，而是“声音秩序”已经开始分裂：美国和英法仍以广播、舞厅、唱片和都市娱乐扩展大众流行，德国、日本和中国则更早感受到审查、殖民扩张和民族危机带来的压力。观众需要看到的是，同样是流行歌曲和电台节目，在不同国家已经被推向完全不同的用途：有的服务商业娱乐，有的被国家审批，有的开始转化为救亡和动员资源。',
    detailEn:
      'This chapter is not about total war already arriving; it is about the sound order beginning to split. The United States, Britain, and France still expanded popular music through radio, dance halls, records, and urban entertainment, while Germany, Japan, and China felt earlier pressure from censorship, imperial expansion, and national crisis. The key evidence is that the same media, song, broadcast, and performance, began serving sharply different purposes: entertainment, state approval, or survival-oriented mobilization.',
    evidencePoints: [
      {
        kind: 'historical-trigger',
        labelZh: '历史触发',
        labelEn: 'Historical trigger',
        titleZh: '东北亚危机与德国文化审批同时抬头',
        titleEn: 'East Asian crisis and German cultural approval rise together',
        bodyZh: '九一八事变和帝国文化院整编说明，战争尚未全面展开时，扩张、审查和职业准入已经开始改变音乐生产的边界。',
        bodyEn: 'The Mukden Incident and Reich Chamber of Culture show that expansion, censorship, and professional admission were already changing the boundaries of music before full-scale war.',
      },
      {
        kind: 'music-mechanism',
        labelZh: '音乐机制',
        labelEn: 'Musical mechanism',
        titleZh: '广播和唱片从娱乐渠道变成治理对象',
        titleEn: 'Radio and records become objects of governance',
        bodyZh: '都市流行仍在发展，但电台、电影歌曲和唱片流通开始被国家、殖民行政和审查制度重新编码。',
        bodyEn: 'Urban pop still developed, but radio, film songs, and record circulation were increasingly recoded by the state, colonial administration, and censorship.',
      },
      {
        kind: 'audible-evidence',
        labelZh: '可见/可听证据',
        labelEn: 'Visible and audible evidence',
        titleZh: '从魏玛舞台到中国救亡歌曲',
        titleEn: 'From Weimar stage song to Chinese resistance song',
        bodyZh: 'Kurt Weill、聂耳、周璇等人物把观众带到具体作品：歌舞厅、电影歌曲和群众歌曲正在形成不同证据链。',
        bodyEn: 'Figures such as Kurt Weill, Nie Er, and Zhou Xuan anchor the chain in actual works: cabaret, film song, and mass song were forming different evidentiary trails.',
      },
    ],
    thumbnail: generatedChapterImage(
      '/images/generated/chapter-prewar-tension.png',
      '战前文化张力章节的生成式档案缩略图',
      'Generated archival thumbnail for the Pre-war Cultural Tension chapter',
    ),
    yearRange: [1931, 1935],
    focusCountryIds: ['de', 'jp', 'cn'],
    focusEventIds: ['mukden-incident', 'reich-chamber'],
    cameraPose: { lat: 42, lng: 82, altitude: 2.15 },
  },
  {
    id: 'chapter-2',
    titleZh: '扩张与宣传',
    titleEn: 'Expansion and Propaganda',
    summaryZh: '轴心国与东亚战线推动国策音乐、广播与仪式节奏同步化。',
    summaryEn: 'Axis politics and the East Asian front synchronize policy songs, broadcasting, and ceremonial rhythm.',
    detailZh:
      '1936-1940 年的证据链更直接：政治扩张把音乐推入宣传和仪式系统。罗马-柏林轴心让威权国家共享进行曲、群众集会、新闻影像和电台纪律的声音模板；全面侵华战争迫使中国音乐中心内迁，使抗战合唱和救亡歌曲成为公共动员工具；欧洲战争爆发后，英法德意的广播不再只是娱乐媒介，而成为组织恐惧、希望、纪律和士气的基础设施。',
    detailEn:
      'The evidence chain from 1936 to 1940 is more explicit: political expansion pushed music into propaganda and ceremony. The Rome-Berlin Axis aligned authoritarian templates of marches, rallies, newsreels, and disciplined radio; the full-scale Sino-Japanese War forced Chinese music centers inland and made resistance chorus a tool of public mobilization; once war broke out in Europe, broadcasting in Britain, France, Germany, and Italy became infrastructure for fear, hope, discipline, and morale rather than entertainment alone.',
    evidencePoints: [
      {
        kind: 'historical-trigger',
        labelZh: '历史触发',
        labelEn: 'Historical trigger',
        titleZh: '轴心整合、侵华战争与欧洲战争连成一条扩张线',
        titleEn: 'Axis alignment, China war, and European war form one expansion line',
        bodyZh: '罗马-柏林轴心、全面侵华战争和欧洲战争爆发把局部管制升级为跨区域的宣传、广播和仪式体系。',
        bodyEn: 'The Rome-Berlin Axis, full-scale war in China, and war in Europe turn local control into regional systems of propaganda, broadcasting, and ceremony.',
      },
      {
        kind: 'music-mechanism',
        labelZh: '音乐机制',
        labelEn: 'Musical mechanism',
        titleZh: '进行曲、国策歌谣和抗战合唱占据前台',
        titleEn: 'Marches, policy songs, and resistance chorus move forward',
        bodyZh: '歌曲不再只是流行消费品，而被配置为政治口号、仪式节奏、募捐巡演和群众教育。',
        bodyEn: 'Songs stop functioning only as consumer entertainment and become political slogans, ceremonial rhythm, fundraising tours, and collective education.',
      },
      {
        kind: 'audible-evidence',
        labelZh: '可见/可听证据',
        labelEn: 'Visible and audible evidence',
        titleZh: '事件图片、相关歌曲和国家风格阶段互相印证',
        titleEn: 'Event images, songs, and country phases corroborate each other',
        bodyZh: '事件详情中的轴心仪式、上海战事、欧洲战争和相关曲目，说明宣传节奏如何进入不同国家的音乐风格。',
        bodyEn: 'The event imagery, Shanghai wartime disruption, European war context, and related songs show propaganda rhythm entering each country’s musical style.',
      },
    ],
    thumbnail: generatedChapterImage(
      '/images/generated/chapter-expansion-propaganda.png',
      '扩张与宣传章节的生成式档案缩略图',
      'Generated archival thumbnail for the Expansion and Propaganda chapter',
    ),
    yearRange: [1936, 1940],
    focusCountryIds: ['de', 'it', 'jp', 'cn'],
    focusEventIds: ['rome-berlin-axis', 'second-sino-japanese-war', 'europe-war'],
    cameraPose: { lat: 36, lng: 58, altitude: 2.25 },
  },
  {
    id: 'chapter-3',
    titleZh: '总体战与压制',
    titleEn: 'Total War and Suppression',
    summaryZh: '前线歌曲、军队演出与广播系统成为动员与情绪管理的核心机制。',
    summaryEn: 'Front songs, troop entertainment, and broadcast systems become core engines of mobilization and emotional management.',
    detailZh:
      '1941-1943 年，音乐已经被总体战完全吸收。巴巴罗萨行动、珍珠港事件和斯大林格勒转折分别把苏德东线、美国参战和战争拐点连接起来。前线歌曲、大型合唱、军中娱乐、短波广播和宣传电影不只是背景声音，而是用来维持士气、划分敌我、组织牺牲叙事和管理家庭离别情绪的工具。',
    detailEn:
      'By 1941-1943, music had been fully absorbed by total war. Operation Barbarossa, Pearl Harbor, and Stalingrad connect the Eastern Front, U.S. entry, and the wartime turning point. Frontline songs, massed chorus, troop entertainment, shortwave broadcasting, and propaganda film were not background sound; they maintained morale, marked enemies, organized sacrifice narratives, and managed the emotional strain of separation.',
    evidencePoints: [
      {
        kind: 'historical-trigger',
        labelZh: '历史触发',
        labelEn: 'Historical trigger',
        titleZh: '东线、太平洋和全球盟军网络同时扩大',
        titleEn: 'Eastern Front, Pacific war, and Allied networks expand together',
        bodyZh: '巴巴罗萨、珍珠港和斯大林格勒让战争进入更高强度阶段，音乐传播也随军队、广播和电影体系扩张。',
        bodyEn: 'Barbarossa, Pearl Harbor, and Stalingrad intensify the war, while musical circulation expands through armies, broadcasting, and film systems.',
      },
      {
        kind: 'music-mechanism',
        labelZh: '音乐机制',
        labelEn: 'Musical mechanism',
        titleZh: '士气音乐和压制性文化管制并行',
        titleEn: 'Morale music and coercive cultural control run in parallel',
        bodyZh: '同一时期既有盟军娱乐和苏联合唱动员，也有德国和日本对音乐空间的持续筛选与规训。',
        bodyEn: 'The same period contains Allied entertainment and Soviet choral mobilization alongside continuing German and Japanese filtering and discipline of musical space.',
      },
      {
        kind: 'audible-evidence',
        labelZh: '可见/可听证据',
        labelEn: 'Visible and audible evidence',
        titleZh: 'V-Disc、前线歌曲和广播人物形成证据链',
        titleEn: 'V-Discs, frontline songs, and radio figures form the evidence chain',
        bodyZh: 'Andrews Sisters、Glenn Miller、Klavdiya Shulzhenko、Lale Andersen 等人物把宏观战局落到具体声音。',
        bodyEn: 'The Andrews Sisters, Glenn Miller, Klavdiya Shulzhenko, Lale Andersen, and others turn the macro war into specific sounds.',
      },
    ],
    thumbnail: generatedChapterImage(
      '/images/generated/chapter-total-war.png',
      '总体战与压制章节的生成式档案缩略图',
      'Generated archival thumbnail for the Total War and Suppression chapter',
    ),
    yearRange: [1941, 1943],
    focusCountryIds: ['us', 'uk', 'su', 'de', 'jp'],
    focusEventIds: ['barbarossa', 'pearl-harbor', 'stalingrad'],
    cameraPose: { lat: 48, lng: 10, altitude: 2.6 },
  },
  {
    id: 'chapter-4',
    titleZh: '转折与交流',
    titleEn: 'Turning Points and Exchange',
    summaryZh: '盟军推进与城市解放，使跨国音乐流动重新打开。',
    summaryEn: 'Allied advances and liberated cities reopen channels of transnational musical exchange.',
    detailZh:
      '1944-1945 年的证据链从“封闭”转向“重新流动”。巴黎解放恢复了香颂、爵士俱乐部和夜生活，也把盟军爵士带回城市空间；德国投降使去纳粹化广播、文化重建和爵士回归成为新起点；日本投降则让占领军广播、俱乐部和电影歌曲迅速改写日本战后流行听觉。音乐在这里不只是庆祝胜利，也记录了占领、重建和跨国接触的重新开启。',
    detailEn:
      'The 1944-1945 chain turns from closure to renewed circulation. The Liberation of Paris reopened chanson, jazz clubs, and nightlife while bringing Allied jazz back into the city; German surrender created a starting point for denazified broadcasting, cultural reconstruction, and the return of jazz; Japan’s surrender allowed occupation radio, clubs, and film song to rapidly rewrite postwar listening. Music here is not only victory celebration; it records occupation, rebuilding, and reopened contact.',
    evidencePoints: [
      {
        kind: 'historical-trigger',
        labelZh: '历史触发',
        labelEn: 'Historical trigger',
        titleZh: '解放与投降改变文化流动方向',
        titleEn: 'Liberation and surrender redirect cultural movement',
        bodyZh: '巴黎解放、德国投降和日本投降把战时封闭的城市、广播和俱乐部网络重新接入盟军与占领秩序。',
        bodyEn: 'Paris liberation, German surrender, and Japanese surrender reconnect wartime-restricted cities, broadcasts, and club networks to Allied and occupation systems.',
      },
      {
        kind: 'music-mechanism',
        labelZh: '音乐机制',
        labelEn: 'Musical mechanism',
        titleZh: '爵士、香颂和广播重建重新定义城市声音',
        titleEn: 'Jazz, chanson, and rebuilt broadcasting redefine city sound',
        bodyZh: '胜利并没有让音乐回到战前，而是把盟军流动、占领政策和本地记忆混合成新的城市声景。',
        bodyEn: 'Victory does not restore prewar music; it mixes Allied circulation, occupation policy, and local memory into new urban soundscapes.',
      },
      {
        kind: 'audible-evidence',
        labelZh: '可见/可听证据',
        labelEn: 'Visible and audible evidence',
        titleZh: '巴黎、柏林、东京的声音转向互相对照',
        titleEn: 'Paris, Berlin, and Tokyo provide contrasting turns',
        bodyZh: 'Piaf、Django Reinhardt、Glenn Miller 和日本战后 boogie 线索，让观众看到同一胜利时刻的不同音乐后果。',
        bodyEn: 'Piaf, Django Reinhardt, Glenn Miller, and Japan’s postwar boogie trail show different musical consequences of the same victory moment.',
      },
    ],
    thumbnail: generatedChapterImage(
      '/images/generated/chapter-turning-points.png',
      '转折与交流章节的生成式档案缩略图',
      'Generated archival thumbnail for the Turning Points and Exchange chapter',
    ),
    yearRange: [1944, 1945],
    focusCountryIds: ['fr', 'us', 'uk', 'de', 'jp'],
    focusEventIds: ['liberation-paris', 'germany-surrender', 'japan-surrender'],
    cameraPose: { lat: 43, lng: 1, altitude: 2.1 },
  },
  {
    id: 'chapter-5',
    titleZh: '战后重建与遗产',
    titleEn: 'Post-war Reconstruction and Legacy',
    summaryZh: '战后广播、唱片与占领秩序重塑了新的全球流行音乐版图。',
    summaryEn: 'Postwar broadcasting, records, and occupation orders reshape a new global map of popular music.',
    detailZh:
      '1946-1949 年的重点是战后秩序如何把战时声音转化为长期遗产。马歇尔援助、唱片市场和广播现代化使西欧更快靠近美国流行工业；占领期日本把爵士、布吉和电影歌曲重新组织成都市娱乐；中国则把抗战时期形成的群众歌曲、合唱组织和电影歌曲经验纳入新的国家叙事。证据链的终点不是战争结束，而是战时传播机制如何成为战后流行音乐、公共广播和国家声音的基础。',
    detailEn:
      'The 1946-1949 focus is how the postwar order turns wartime sound into lasting legacy. Marshall Aid, record markets, and broadcast modernization pull Western Europe toward the U.S. popular industry; occupation Japan reorganizes jazz, boogie, and film song into urban entertainment; China folds wartime mass song, choral organization, and film-song experience into a new state narrative. The chain does not end with the war; it shows wartime circulation becoming the basis for postwar popular music, public broadcasting, and state sound.',
    evidencePoints: [
      {
        kind: 'historical-trigger',
        labelZh: '历史触发',
        labelEn: 'Historical trigger',
        titleZh: '援助、占领和建国共同塑造新秩序',
        titleEn: 'Aid, occupation, and state founding shape the new order',
        bodyZh: '马歇尔援助、占领广播和中华人民共和国成立把战后音乐问题放进经济、军事和国家制度框架。',
        bodyEn: 'Marshall Aid, occupation broadcasting, and the founding of the PRC place postwar music inside economic, military, and state frameworks.',
      },
      {
        kind: 'music-mechanism',
        labelZh: '音乐机制',
        labelEn: 'Musical mechanism',
        titleZh: '唱片工业、公共广播和国家叙事接管战时遗产',
        titleEn: 'Records, public broadcasting, and state narrative inherit wartime systems',
        bodyZh: '战时的传播网络没有消失，而是被唱片公司、电台、占领机构和新国家制度重新配置。',
        bodyEn: 'Wartime circulation networks do not disappear; record companies, broadcasters, occupation authorities, and new state systems reconfigure them.',
      },
      {
        kind: 'audible-evidence',
        labelZh: '可见/可听证据',
        labelEn: 'Visible and audible evidence',
        titleZh: '从 Nat King Cole 到《义勇军进行曲》',
        titleEn: 'From Nat King Cole to March of the Volunteers',
        bodyZh: '美国流行唱片、西欧广播现代化、日本 boogie 和中国群众歌曲共同说明，战后流行版图是战时声音机制的延续。',
        bodyEn: 'U.S. popular records, Western European broadcast modernization, Japanese boogie, and Chinese mass song together show the postwar map continuing wartime sound systems.',
      },
    ],
    thumbnail: generatedChapterImage(
      '/images/generated/chapter-reconstruction.png',
      '战后重建与遗产章节的生成式档案缩略图',
      'Generated archival thumbnail for the Post-war Reconstruction and Legacy chapter',
    ),
    yearRange: [1946, 1949],
    focusCountryIds: ['us', 'fr', 'jp', 'cn', 'uk'],
    focusEventIds: ['marshall-broadcast', 'prc-founding'],
    cameraPose: { lat: 34, lng: 55, altitude: 2.4 },
  },
]
