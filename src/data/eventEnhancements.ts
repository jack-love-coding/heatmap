import type { EventImage, HistoricEvent, RelatedSong } from '@/data/ww2MusicAtlas'
import { publicAssetPath } from '@/lib/publicAssets'

type EventEnhancement = Pick<
  HistoricEvent,
  'longDescriptionZh' | 'longDescriptionEn' | 'musicImpactZh' | 'musicImpactEn' | 'relatedSongs' | 'image'
>

function image(input: Omit<EventImage, 'generated'>): EventImage {
  return { ...input, src: publicAssetPath(input.src), generated: false }
}

function song(input: RelatedSong): RelatedSong {
  if (input.streamUrl) {
    return { ...input, streamUrl: publicAssetPath(input.streamUrl) }
  }

  return input
}

const commonsLicense = 'https://commons.wikimedia.org/wiki/Commons:Licensing'

export const eventEnhancementsById: Record<string, EventEnhancement> = {
  'mukden-incident': {
    longDescriptionZh:
      '九一八事变让东北亚的战争秩序提前成形。日本占领东北后，城市娱乐、电影歌曲和唱片网络被更强的殖民行政、新闻审查与军事宣传包围；中国音乐人和文化机构则开始把“流亡”“救亡”“民族共同体”写入歌曲生产。',
    longDescriptionEn:
      'The Mukden Incident made the wartime order in Northeast Asia visible years before the wider war. Japanese occupation surrounded urban entertainment, film song, and record networks with colonial administration and military messaging, while Chinese musicians increasingly wrote displacement, national survival, and collective identity into song.',
    musicImpactZh:
      '它把东亚流行音乐从都市消费推向政治化传播：上海时代曲仍在发展，但抗战合唱、救亡歌曲和日本国策歌谣开始成为新的主轴。',
    musicImpactEn:
      'It pushed East Asian popular music from urban consumption toward politicized circulation: Shanghai shidaiqu continued, but Chinese resistance chorus and Japanese policy songs became the new axis.',
    relatedSongs: [
      song({
        title: 'March of the Volunteers',
        performer: 'Nie Er / Tian Han',
        year: '1935',
        noteZh: '从电影歌曲进入民族动员语境，后来成为中国战时公共声音的核心符号。',
        noteEn: 'A film song that entered national mobilization and became a defining sound of wartime China.',
        sourceUrl: 'https://link.springer.com/article/10.1186/s41257-026-00150-4',
        rightsLabel: 'Archive and scholarship reference only',
      }),
      song({
        title: 'Song of the Great Wall',
        performer: 'Liu Xue’an / Pan Zi-nong',
        year: '1937',
        noteZh: '以长城意象组织救亡情绪，显示抗战歌曲如何把地理符号转化为合唱动员。',
        noteEn: 'Uses the Great Wall as a mobilizing image, showing how resistance song turned geography into choral solidarity.',
        sourceUrl: 'https://link.springer.com/article/10.1186/s41257-026-00150-4',
        rightsLabel: 'Scholarship reference only',
      }),
      song({
        title: 'Tokyo Rhapsody',
        performer: 'Ichiro Fujiyama',
        year: '1936',
        noteZh: '保留战前日本都市流行歌的明亮面貌，也衬托随后国策歌谣的收紧。',
        noteEn: 'Captures the bright urban side of prewar Japanese pop, highlighting the later tightening into policy song.',
        sourceUrl: 'https://sciendo.com/article/10.2478/vjeas-2011-0011',
        rightsLabel: 'Scholarship reference only',
      }),
    ],
    image: image({
      src: '/images/events/mukden-incident.webp',
      altZh: '九一八事变后沈阳街头的历史照片',
      altEn: 'Historical photograph from Shenyang after the Mukden Incident',
      credit: 'Unknown author via Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mukden_1931_japan_shenyang.jpg',
      licenseLabel: 'Public domain on Wikimedia Commons',
      licenseUrl: commonsLicense,
    }),
  },
  'reich-chamber': {
    longDescriptionZh:
      '帝国文化院把作曲、演出、出版、广播和音乐教育纳入职业准入制度，音乐不再只是审美领域，而成为国家身份筛选的一部分。犹太音乐家、左翼剧场、爵士和魏玛实验传统被排斥，留下来的娱乐音乐也必须服从审查和宣传边界。',
    longDescriptionEn:
      'The Reich Chamber of Culture folded composition, performance, publishing, broadcasting, and music education into a system of professional admission. Music became a tool of national screening: Jewish musicians, left theatre, jazz, and Weimar experiment were excluded, while approved entertainment stayed inside censorship and propaganda limits.',
    musicImpactZh:
      '这一制度打断了魏玛时期的混合现代性，使德国音乐从卡巴莱、爵士和政治剧场转向受控轻音乐、进行曲和官方广播编排。',
    musicImpactEn:
      'The system broke the hybrid modernity of Weimar music and redirected German sound from cabaret, jazz, and political theatre toward controlled light music, marches, and state-approved broadcasting.',
    relatedSongs: [
      song({
        title: 'Mack the Knife',
        performer: 'Kurt Weill / Bertolt Brecht',
        year: '1928',
        noteZh: '魏玛剧场歌曲的代表，正是纳粹文化清洗要排除的都市讽刺与现代主义声音。',
        noteEn: 'A landmark of Weimar theatre song and the kind of urban satire and modernism targeted by Nazi cultural purges.',
        sourceUrl: 'https://www.kwf.org/about/',
        rightsLabel: 'Foundation reference only',
      }),
      song({
        title: 'Falling in Love Again',
        performer: 'Marlene Dietrich',
        year: '1930',
        noteZh: '连接魏玛电影、歌舞厅与流亡明星体系，呈现被政治断裂切开的都市娱乐传统。',
        noteEn: 'Links Weimar cinema, cabaret, and exile celebrity, showing the entertainment tradition cut apart by politics.',
        sourceUrl: 'https://www.kwf.org/about/',
        rightsLabel: 'Historical reference only',
      }),
      song({
        title: 'Lili Marleen',
        performer: 'Lale Andersen',
        year: '1939 / wartime circulation',
        noteZh: '说明审查体制下仍可能出现跨战线传播的抒情歌曲。',
        noteEn: 'Shows how a lyrical song could still circulate across enemy lines inside a censored system.',
        sourceUrl: 'http://www.iwm.org.uk/collections/item/object/205124602',
        rightsLabel: 'Archive record only',
        rightsUrl: 'https://www.iwm.org.uk/terms-and-conditions',
      }),
    ],
    image: image({
      src: '/images/events/reich-chamber.webp',
      altZh: '1937 年《帝国文化院手册》中的机构页面',
      altEn: 'A 1937 Reich Chamber of Culture handbook page',
      credit: 'Handbuch der Reichskulturkammer via Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Reichskulturkammer_1937.jpg',
      licenseLabel: 'CC0 on Wikimedia Commons',
      licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
    }),
  },
  'rome-berlin-axis': {
    longDescriptionZh:
      '罗马-柏林轴心使意大利法西斯和德国纳粹的政治节奏开始相互对齐。它不仅是外交事件，也意味着广播、仪式、新闻影像和群众集会中的声音组织逐渐共享同一种威权美学。',
    longDescriptionEn:
      'The Rome-Berlin Axis aligned Fascist Italy and Nazi Germany politically and symbolically. It was not only diplomacy: radio, ceremony, newsreel, and mass-rally sound increasingly shared an authoritarian aesthetic.',
    musicImpactZh:
      '轴心合作强化了进行曲、合唱口号和仪式音乐的跨国模板，同时挤压爵士、歌舞厅和地方娱乐的自由空间。',
    musicImpactEn:
      'Axis cooperation strengthened transnational templates of marches, choral slogans, and ceremonial music while narrowing space for jazz, cabaret, and local entertainment.',
    relatedSongs: [
      song({
        title: 'Faccetta Nera',
        performer: 'Carlo Buti',
        year: '1935',
        noteZh: '殖民宣传与大众旋律结合的例子，体现意大利官方仪式声与流行传播的交叠。',
        noteEn: 'An example of colonial propaganda fused with popular melody, showing how ceremony and mass song overlapped in Italy.',
        sourceUrl: 'https://canzoneitaliana.it/en/canzone/faccetta-nera-testo-ufficiale-dello-spartito-en/',
        rightsLabel: 'Archive record only',
      }),
      song({
        title: 'Giovinezza',
        performer: 'Italian Fascist movement song',
        year: '1920s-1930s',
        noteZh: '作为仪式歌曲，它说明政治运动如何把青年、队列和声乐口号绑定在一起。',
        noteEn: 'As a ceremonial song, it shows how political movements bound youth, formation, and vocal slogan together.',
        sourceUrl: 'https://www.britannica.com/place/Italy/Music',
        rightsLabel: 'Historical reference only',
      }),
      song({
        title: 'Horst-Wessel-Lied',
        performer: 'Nazi Party song',
        year: '1929',
        noteZh: '纳粹仪式音乐的核心例子，显示轴心文化中进行曲节奏和政治忠诚的结合。',
        noteEn: 'A central Nazi ceremonial song, illustrating the fusion of march rhythm and political loyalty in Axis culture.',
        sourceUrl: 'https://encyclopedia.ushmm.org/content/en/article/degenerate-art-1',
        rightsLabel: 'Historical reference only',
      }),
    ],
    image: image({
      src: '/images/events/rome-berlin-axis.webp',
      altZh: '1938 年报刊中关于罗马-柏林轴心的版面',
      altEn: 'A 1938 press page referring to the Rome-Berlin Axis',
      credit: 'Digital Tessmann / Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:DOL_1938_03_16_1_Achse_Rom_Berlin.png',
      licenseLabel: 'CC BY-SA 4.0 on Wikimedia Commons',
      licenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0',
    }),
  },
  'second-sino-japanese-war': {
    longDescriptionZh:
      '全面侵华战争切断了上海、南京等城市的正常文化工业链。唱片公司、电影公司、音乐家和学生团体向内地转移，歌曲成为募捐、宣传、巡演和集体教育的工具；日本方面则进一步用广播和国策歌曲组织战时情绪。',
    longDescriptionEn:
      'The full-scale Sino-Japanese War disrupted the cultural industries of Shanghai, Nanjing, and other cities. Record companies, film studios, musicians, and student groups moved inland; song became a tool for fundraising, touring, propaganda, and collective education, while Japan intensified radio and policy song.',
    musicImpactZh:
      '中国音乐从都市流行转向群众合唱和抗战歌曲，日本流行歌则更多服从军国主义、乡愁和家庭叙事的情绪管理。',
    musicImpactEn:
      'Chinese music moved from urban pop toward mass chorus and resistance song, while Japanese popular song increasingly served militarism, nostalgia, and emotional management.',
    relatedSongs: [
      song({
        title: 'March of the Volunteers',
        performer: 'Nie Er / Tian Han',
        year: '1935',
        noteZh: '在战争语境中成为抗战动员的代表歌曲。',
        noteEn: 'Became one of the representative songs of Chinese wartime mobilization.',
        sourceUrl: 'https://link.springer.com/article/10.1186/s41257-026-00150-4',
        rightsLabel: 'Scholarship reference only',
      }),
      song({
        title: 'Yellow River Cantata',
        performer: 'Xian Xinghai / Guang Weiran',
        year: '1939',
        noteZh: '大型合唱把民族危机转化为可巡演、可组织、可共同演唱的公共音乐。',
        noteEn: 'A large cantata that turned national crisis into public music that could tour, organize, and be sung collectively.',
        sourceUrl: 'https://www.icm.gov.mo/ef/news/detail/18214',
        rightsLabel: 'Museum reference only',
      }),
      song({
        title: 'Umi Yukaba',
        performer: 'Kiyoshi Nobutoki',
        year: '1937',
        noteZh: '日本战时国家歌曲之一，体现牺牲、忠诚与广播纪律化。',
        noteEn: 'One of Japan’s wartime state songs, tying sacrifice and loyalty to disciplined broadcasting.',
        sourceUrl: 'https://sciendo.com/article/10.2478/vjeas-2011-0011',
        rightsLabel: 'Scholarship reference only',
      }),
    ],
    image: image({
      src: '/images/events/second-sino-japanese-war.webp',
      altZh: '1937 年上海战事中的中国战俘照片',
      altEn: 'Chinese prisoners of war in Shanghai, August 1937',
      credit: 'Japanese reporter via Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Chinese_prisoners_of_war_at_Shanghai,_August_1937.jpg',
      licenseLabel: 'Public domain on Wikimedia Commons',
      licenseUrl: commonsLicense,
    }),
  },
  'europe-war': {
    longDescriptionZh:
      '1939 年欧洲战争爆发后，广播、新闻电影和唱片不再只是娱乐渠道，而成为各国政府组织信息、恐惧、希望和纪律的基础设施。音乐节目必须服务防空、征兵、工厂劳动和前线慰问。',
    longDescriptionEn:
      'After war broke out in Europe in 1939, radio, newsreel, and records ceased to be merely entertainment channels. They became infrastructure for organizing information, fear, hope, and discipline, with music serving air-raid life, recruitment, factory work, and morale.',
    musicImpactZh:
      '英法德意的音乐都被压缩进战时功能：轻音乐、香颂、舞曲和进行曲被重新分配为慰藉、暗号、动员或审查后的消遣。',
    musicImpactEn:
      'British, French, German, and Italian music were pressed into wartime function: light music, chanson, dance tunes, and marches were recoded as comfort, coded speech, mobilization, or censored diversion.',
    relatedSongs: [
      song({
        title: "We'll Meet Again",
        performer: 'Vera Lynn',
        year: '1939',
        noteZh: '把离别与重逢写成战时英国广播中最具识别度的情感公式。',
        noteEn: 'Turned separation and reunion into one of the most recognizable emotional formulas of British wartime broadcasting.',
        sourceUrl: 'https://www.iwm.org.uk/collections/sound',
        rightsLabel: 'Archive record only',
        rightsUrl: 'https://www.iwm.org.uk/terms-and-conditions',
      }),
      song({
        title: 'J’attendrai',
        performer: 'Rina Ketty',
        year: '1938 / wartime circulation',
        noteZh: '等待主题在战争初期被重新听见，成为法语流行歌中的悬置情绪。',
        noteEn: 'Its theme of waiting was re-heard in wartime, becoming a suspended emotional register in French popular song.',
        sourceUrl: 'https://gallica.bnf.fr/accueil/fr/html/damia-la-tragedienne-de-la-chanson',
        rightsLabel: 'Archive essay reference only',
      }),
      song({
        title: 'Lili Marleen',
        performer: 'Lale Andersen',
        year: '1939 / wartime circulation',
        noteZh: '从德国广播扩散到多国前线，是欧洲战时歌曲跨界传播的关键例子。',
        noteEn: 'Spread from German broadcasting to multiple fronts, making it a key example of wartime cross-border song circulation.',
        sourceUrl: 'http://www.iwm.org.uk/collections/item/object/205124602',
        rightsLabel: 'Archive record only',
        rightsUrl: 'https://www.iwm.org.uk/terms-and-conditions',
      }),
    ],
    image: image({
      src: '/images/events/europe-war.webp',
      altZh: '1939 年波兰战役示意图',
      altEn: 'Map of the September 1939 campaign in Poland',
      credit: 'Poeticbent / Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Wrzesien2.jpg',
      licenseLabel: 'Public domain on Wikimedia Commons',
      licenseUrl: commonsLicense,
    }),
  },
  barbarossa: {
    longDescriptionZh:
      '巴巴罗萨行动把欧洲战争扩大为东线总体战。城市围困、村庄破坏、军队推进和大规模伤亡，使音乐被迫承载更高密度的牺牲叙事、家园叙事和敌我划分。',
    longDescriptionEn:
      'Operation Barbarossa transformed the European war into total war on the Eastern Front. Siege, village destruction, military advance, and mass death forced music to carry denser narratives of sacrifice, homeland, and enemy distinction.',
    musicImpactZh:
      '苏联歌曲转向大合唱、前线抒情和爱国史诗；德国方面则继续把轻音乐与士兵广播维系为秩序工具，但东线压力逐渐改变其情绪底色。',
    musicImpactEn:
      'Soviet song leaned into mass chorus, frontline lyricism, and patriotic epic; Germany kept light music and soldier broadcasting as tools of order, though the Eastern Front darkened their emotional ground.',
    relatedSongs: [
      song({
        title: 'Sacred War',
        performer: 'Alexandrov Ensemble tradition',
        year: '1941',
        noteZh: '以庄严合唱定义“卫国战争”的公共语气。',
        noteEn: 'Defined the public tone of the Great Patriotic War through solemn massed chorus.',
        sourceUrl: 'https://www.britannica.com/place/Russia/Music',
        rightsLabel: 'Historical reference only',
      }),
      song({
        title: 'Katyusha',
        performer: 'Matvey Blanter / Mikhail Isakovsky',
        year: '1938 / wartime circulation',
        noteZh: '把民歌式旋律、爱情等待和前线想象结合，成为苏联战时传播最广的歌曲之一。',
        noteEn: 'Joined folk-like melody, romantic waiting, and frontline imagination, becoming one of the most widely circulated Soviet wartime songs.',
        sourceUrl: 'https://www.britannica.com/place/Russia/Music',
        rightsLabel: 'Historical reference only',
      }),
      song({
        title: 'Lili Marleen',
        performer: 'Lale Andersen',
        year: '1941-1942 frontline circulation',
        noteZh: '在东线和北非等战场被双方士兵收听，说明战时抒情歌可越过宣传边界。',
        noteEn: 'Heard by soldiers across fronts, showing how wartime lyric song could cross propaganda boundaries.',
        sourceUrl: 'http://www.iwm.org.uk/collections/item/object/205124602',
        rightsLabel: 'Archive record only',
        rightsUrl: 'https://www.iwm.org.uk/terms-and-conditions',
      }),
    ],
    image: image({
      src: '/images/events/barbarossa.webp',
      altZh: '巴巴罗萨行动相关历史照片拼贴',
      altEn: 'Historical collage associated with Operation Barbarossa',
      credit: 'Bundesarchiv and RIA Novosti files via Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Operation_Barbarossa_collage.jpg',
      licenseLabel: 'CC0 on Wikimedia Commons',
      licenseUrl: 'http://creativecommons.org/publicdomain/zero/1.0/deed.en',
    }),
  },
  'pearl-harbor': {
    longDescriptionZh:
      '珍珠港事件使美国从观察者转为参战者。军中慰问演出、V-Disc 唱片、短波广播和好莱坞歌曲工业迅速进入全球战争网络，美国流行乐开始和盟军士气、基地文化、跨太平洋传播绑定。',
    longDescriptionEn:
      'Pearl Harbor moved the United States from observer to combatant. Troop shows, V-Discs, shortwave radio, and Hollywood song production entered a global war network, binding American popular music to Allied morale, base culture, and trans-Pacific circulation.',
    musicImpactZh:
      '摇摆乐、和声女声组合、军中布吉和爱国流行歌获得新的传播渠道，美国声音由国内舞厅扩展为全球盟军声景。',
    musicImpactEn:
      'Swing, close-harmony vocal groups, military boogie, and patriotic pop gained new channels, turning the American sound from dance-hall culture into an Allied global soundscape.',
    relatedSongs: [
      song({
        title: 'Boogie Woogie Bugle Boy',
        performer: 'The Andrews Sisters',
        year: '1941',
        noteZh: '把摇摆节奏和军中角色结合，是美国战时娱乐网络的标志性声音。',
        noteEn: 'Fused swing rhythm with military character and became a signature sound of U.S. wartime entertainment.',
        sourceUrl: 'https://blogs.loc.gov/loc/2020/10/a-soundtrack-of-world-war-ii/',
        rightsLabel: 'Archive essay reference only',
      }),
      song({
        title: 'Remember Pearl Harbor',
        performer: 'Sammy Kaye and others',
        year: '1941',
        noteZh: '事件本身迅速进入流行歌标题，体现歌曲工业对战争新闻的快速响应。',
        noteEn: 'The event moved quickly into song titles, showing how the music industry responded to war news.',
        sourceUrl: 'https://www.loc.gov/research-centers/recorded-sound/collections/',
        rightsLabel: 'Archive gateway reference only',
      }),
      song({
        title: 'Praise the Lord and Pass the Ammunition',
        performer: 'Frank Loesser',
        year: '1942',
        noteZh: '把口号、幽默和战斗动员结合，代表美国战时流行歌的宣传化转向。',
        noteEn: 'Combined slogan, humor, and mobilization, representing the propagandistic turn of U.S. wartime pop.',
        sourceUrl: 'https://blogs.loc.gov/loc/2020/10/a-soundtrack-of-world-war-ii/',
        rightsLabel: 'Archive essay reference only',
      }),
    ],
    image: image({
      src: '/images/events/pearl-harbor.webp',
      altZh: '珍珠港袭击中 USS Shaw 爆炸的照片',
      altEn: 'USS Shaw exploding during the attack on Pearl Harbor',
      credit: 'Unknown U.S. Navy photographer / U.S. National Archives via Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:USS_SHAW_exploding_Pearl_Harbor_Nara_80-G-16871_2.jpg',
      licenseLabel: 'Public domain on Wikimedia Commons',
      licenseUrl: commonsLicense,
    }),
  },
  stalingrad: {
    longDescriptionZh:
      '斯大林格勒战役把东线的牺牲叙事推向顶点。城市废墟和战局反转使苏联音乐获得更强烈的胜利预感，也让德国受控娱乐中的轻松、舞曲和慰问功能变得越来越难维持。',
    longDescriptionEn:
      'Stalingrad pushed the Eastern Front’s sacrifice narrative to its peak. Urban ruins and military reversal gave Soviet music a stronger sense of coming victory, while Germany’s controlled entertainment found it harder to preserve lightness and morale.',
    musicImpactZh:
      '苏联前线歌曲更强调坚守、哀悼与英雄化；德国广播则从自信动员转向维持士气，娱乐音乐的稳定性被战局侵蚀。',
    musicImpactEn:
      'Soviet frontline song emphasized endurance, mourning, and heroism; German broadcasting shifted from confident mobilization toward morale maintenance as the battlefield eroded entertainment stability.',
    relatedSongs: [
      song({
        title: 'The Blue Scarf',
        performer: 'Klavdiya Shulzhenko',
        year: '1942 / WWII circulation',
        noteZh: '以抒情前线歌曲表达离别与坚守，代表苏联战时情感动员的柔性一面。',
        noteEn: 'A lyrical frontline song of separation and endurance, representing the softer side of Soviet emotional mobilization.',
        sourceUrl: 'https://www.iwm.org.uk/collections/item/object/80030723',
        rightsLabel: 'Archive record only',
        rightsUrl: 'https://www.iwm.org.uk/terms-and-conditions',
      }),
      song({
        title: 'Dark Night',
        performer: 'Mark Bernes',
        year: '1943',
        noteZh: '通过私人化抒情表达战时家庭和前线之间的情感纽带。',
        noteEn: 'Uses private lyricism to express the emotional bond between home and front.',
        sourceUrl: 'https://www.britannica.com/place/Russia/Music',
        rightsLabel: 'Historical reference only',
      }),
      song({
        title: 'Sacred War',
        performer: 'Alexandrov Ensemble tradition',
        year: '1941',
        noteZh: '在转折点之后继续提供庄严、集体化的胜利叙事框架。',
        noteEn: 'Continued to provide a solemn collective frame for victory narratives after the turning point.',
        sourceUrl: 'https://www.britannica.com/place/Russia/Music',
        rightsLabel: 'Historical reference only',
      }),
    ],
    image: image({
      src: '/images/events/stalingrad.webp',
      altZh: '斯大林格勒废墟中的“儿童圆舞”喷泉照片',
      altEn: 'The Children’s Khorovod fountain amid the ruins of Stalingrad',
      credit: 'Sergey Strunnikov via Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:%D0%A4%D0%BE%D0%BD%D1%82%D0%B0%D0%BD_%C2%AB%D0%94%D0%B5%D1%82%D1%81%D0%BA%D0%B8%D0%B9_%D1%85%D0%BE%D1%80%D0%BE%D0%B2%D0%BE%D0%B4%C2%BB.jpg',
      licenseLabel: 'Public domain on Wikimedia Commons',
      licenseUrl: commonsLicense,
    }),
  },
  'liberation-paris': {
    longDescriptionZh:
      '巴黎解放重新打开了被占领时期压缩的夜生活、俱乐部和香颂空间。盟军进入城市后，美国爵士、法国香颂、咖啡馆文化和抵抗记忆迅速叠合，巴黎又成为跨大西洋音乐流动的节点。',
    longDescriptionEn:
      'The Liberation of Paris reopened nightlife, clubs, and chanson spaces compressed under occupation. Allied arrival brought American jazz, French chanson, café culture, and resistance memory into contact, returning Paris to transatlantic musical circulation.',
    musicImpactZh:
      '香颂从占领时期的隐喻生存转向解放后的公共庆祝，爵士俱乐部复兴则把巴黎夜生活推向更国际化的声音。',
    musicImpactEn:
      'Chanson moved from coded survival under occupation to public celebration, while jazz-club revival gave Paris nightlife a more international sound.',
    relatedSongs: [
      song({
        title: 'La Marseillaise',
        performer: 'Public ceremonial repertoire',
        year: '1792 / liberation circulation',
        noteZh: '作为解放场景中最强烈的公共声响，连接抵抗、共和国和街头庆祝。',
        noteEn: 'The most powerful public sound of liberation scenes, linking resistance, republic, and street celebration.',
        sourceUrl: 'https://commons.wikimedia.org/wiki/File:La_Marseillaise.ogg',
        streamUrl: '/audio/background/la-marseillaise.ogg',
        rightsLabel: 'Public domain local playback',
        rightsUrl: commonsLicense,
      }),
      song({
        title: 'Nuages',
        performer: 'Django Reinhardt',
        year: '1940',
        noteZh: '占领时期巴黎爵士的象征，解放后继续连接本地俱乐部与国际爵士网络。',
        noteEn: 'A symbol of occupation-era Paris jazz that continued to link local clubs to international jazz networks after liberation.',
        sourceUrl: 'https://www.britannica.com/biography/Django-Reinhardt',
        rightsLabel: 'Biography reference only',
      }),
      song({
        title: 'La Vie en rose',
        performer: 'Edith Piaf',
        year: '1946',
        noteZh: '把战后巴黎的亲密香颂变成国际化标识。',
        noteEn: 'Turned postwar Parisian intimate chanson into an international signature.',
        sourceUrl: 'https://www.ina.fr/ina-eclaire-actu/video/i00013654/edith-piaf-la-vie-en-rose',
        rightsLabel: 'External archive playback',
        rightsUrl: 'https://www.ina.fr/rights',
      }),
    ],
    image: image({
      src: '/images/events/liberation-paris.webp',
      altZh: '巴黎解放时香榭丽舍大街上的人群',
      altEn: 'Crowds on the Champs Elysees during the Liberation of Paris',
      credit: 'Jack Downey, U.S. Office of War Information / Library of Congress via Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Crowds_of_French_patriots_line_the_Champs_Elysees-edit2.jpg',
      licenseLabel: 'Public domain on Wikimedia Commons',
      licenseUrl: commonsLicense,
    }),
  },
  'germany-surrender': {
    longDescriptionZh:
      '德国投降结束了欧洲战事，也开启了占领区广播、去纳粹化教育和文化重建。音乐机构必须重新证明自身合法性，流亡音乐、爵士、室内乐和公共广播成为重塑德国声音身份的入口。',
    longDescriptionEn:
      'Germany’s surrender ended the war in Europe and opened occupation broadcasting, denazification education, and cultural reconstruction. Musical institutions had to renegotiate legitimacy as exile music, jazz, chamber music, and public broadcasting became routes to a new German sonic identity.',
    musicImpactZh:
      '受控娱乐和宣传音乐失去制度中心；盟军广播、爵士回归和古典音乐重建共同改变了战后欧洲音乐版图。',
    musicImpactEn:
      'Controlled entertainment and propaganda music lost their institutional center; Allied broadcasting, jazz’s return, and classical reconstruction reshaped the postwar European map.',
    relatedSongs: [
      song({
        title: "We'll Meet Again",
        performer: 'Vera Lynn',
        year: '1939 / VE Day resonance',
        noteZh: '在胜利日语境中重新指向归来、团聚和战后生活。',
        noteEn: 'On VE Day it pointed anew toward return, reunion, and postwar life.',
        sourceUrl: 'https://www.iwm.org.uk/collections/sound',
        rightsLabel: 'Archive record only',
        rightsUrl: 'https://www.iwm.org.uk/terms-and-conditions',
      }),
      song({
        title: 'Lili Marleen',
        performer: 'Lale Andersen',
        year: 'wartime circulation',
        noteZh: '战后成为跨阵营战争记忆的一部分，说明歌曲意义会脱离原先宣传系统。',
        noteEn: 'Became part of cross-front war memory after 1945, showing how a song could outlive its propaganda system.',
        sourceUrl: 'http://www.iwm.org.uk/collections/item/object/205124602',
        rightsLabel: 'Archive record only',
        rightsUrl: 'https://www.iwm.org.uk/terms-and-conditions',
      }),
      song({
        title: 'In the Mood',
        performer: 'Glenn Miller Orchestra',
        year: '1939 / Allied wartime circulation',
        noteZh: '盟军广播中的美国摇摆乐代表，战后继续影响欧洲舞厅和电台。',
        noteEn: 'A representative Allied-broadcast swing number that continued to shape European dance halls and radio after the war.',
        sourceUrl: 'https://www.loc.gov/research-centers/recorded-sound/collections/',
        rightsLabel: 'Archive gateway reference only',
      }),
    ],
    image: image({
      src: '/images/events/germany-surrender.webp',
      altZh: '德国无条件投降文件照片',
      altEn: 'Photograph of the German instrument of surrender',
      credit: 'Office of War Information via Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:German_instrument_of_surrender2.jpg',
      licenseLabel: 'Public domain on Wikimedia Commons',
      licenseUrl: commonsLicense,
    }),
  },
  'japan-surrender': {
    longDescriptionZh:
      '日本投降结束了亚太战争，也使占领军广播、俱乐部和审查制度进入日本音乐生活。战时国策歌谣迅速失去主导地位，战后都市娱乐用爵士、布吉和电影歌曲重新组织流行听觉。',
    longDescriptionEn:
      'Japan’s surrender ended the Asia-Pacific War and brought occupation broadcasting, clubs, and censorship into Japanese musical life. Wartime policy songs quickly lost dominance as postwar urban entertainment reorganized popular listening around jazz, boogie, and film song.',
    musicImpactZh:
      '音乐风格从军歌和国策抒情转向占领期爵士、布吉和战后电影歌曲，城市舞台重新成为流行文化核心。',
    musicImpactEn:
      'Musical style shifted from military and policy song toward occupation-era jazz, boogie, and postwar film song, making the urban stage central again.',
    relatedSongs: [
      song({
        title: 'Ringo no Uta',
        performer: 'Namiki Michiko',
        year: '1945',
        noteZh: '常被视为战后日本流行歌重启的象征，以轻快旋律替代战时纪律化声音。',
        noteEn: 'Often treated as a symbol of Japanese popular song’s restart, replacing wartime discipline with a lighter tone.',
        sourceUrl: 'https://www.nippon.com/en/japan-topics/g02332/',
        rightsLabel: 'Historical essay reference only',
      }),
      song({
        title: 'Tokyo Boogie-Woogie',
        performer: 'Shizuko Kasagi',
        year: '1947',
        noteZh: '把布吉节奏、舞台能量和战后都市复兴结合，是占领期再流行化的关键歌曲。',
        noteEn: 'Joined boogie rhythm, stage energy, and postwar urban revival, making it a key song of occupation-era repopularization.',
        sourceUrl: 'https://www.nippon.com/en/japan-topics/g02332/',
        rightsLabel: 'Archive record only',
      }),
      song({
        title: 'Umi Yukaba',
        performer: 'Kiyoshi Nobutoki',
        year: '1937 / wartime circulation',
        noteZh: '作为战时国策歌曲的残影，帮助对比投降后日本声音的急速转向。',
        noteEn: 'A shadow of wartime state song that clarifies how quickly Japanese sound shifted after surrender.',
        sourceUrl: 'https://sciendo.com/article/10.2478/vjeas-2011-0011',
        rightsLabel: 'Scholarship reference only',
      }),
    ],
    image: image({
      src: '/images/events/japan-surrender.webp',
      altZh: '重光葵在密苏里号上签署日本投降书',
      altEn: 'Mamoru Shigemitsu signing the Japanese Instrument of Surrender',
      credit: 'Army Signal Corps photographer LT. Stephen E. Korpanty / Wikimedia Commons',
      sourceUrl:
        'https://commons.wikimedia.org/wiki/File:Mamoru_Shigemitsu_signs_the_Instrument_of_Surrender,_officially_ending_the_Second_World_War.jpg',
      licenseLabel: 'Public domain on Wikimedia Commons',
      licenseUrl: commonsLicense,
    }),
  },
  'marshall-broadcast': {
    longDescriptionZh:
      '马歇尔援助不仅是经济重建，也推动西欧广播、唱片流通和文化工业的现代化。美国资金、节目格式、唱片市场和驻军文化共同改变了英国、法国、意大利等地的战后流行音乐生态。',
    longDescriptionEn:
      'Marshall Aid was not only economic reconstruction; it also accelerated modernization in Western European broadcasting, record circulation, and cultural industry. U.S. funding, program formats, record markets, and troop culture reshaped postwar popular music in Britain, France, Italy, and beyond.',
    musicImpactZh:
      '西欧音乐市场更快靠近美国流行工业：crooner、bebop、电影歌曲和广播节目模式成为战后消费文化的模板。',
    musicImpactEn:
      'Western European music markets moved faster toward the U.S. popular industry: crooners, bebop, film song, and broadcast formats became templates for postwar consumer culture.',
    relatedSongs: [
      song({
        title: 'Nature Boy',
        performer: 'Nat King Cole',
        year: '1948',
        noteZh: '代表战后美国流行唱片工业的柔和、国际化声线。',
        noteEn: 'Represents the softer, internationalized voice of the postwar U.S. record industry.',
        sourceUrl: 'https://www.loc.gov/research-centers/recorded-sound/collections/',
        rightsLabel: 'Archive gateway reference only',
      }),
      song({
        title: 'Buttons and Bows',
        performer: 'Dinah Shore',
        year: '1948',
        noteZh: '电影歌曲和广播明星制说明美国娱乐工业如何进入战后欧洲想象。',
        noteEn: 'Film song and radio stardom show how U.S. entertainment entered postwar European imagination.',
        sourceUrl: 'https://www.loc.gov/research-centers/recorded-sound/collections/',
        rightsLabel: 'Archive gateway reference only',
      }),
      song({
        title: 'Move',
        performer: 'Denzil Best / Miles Davis nonet repertoire',
        year: '1949',
        noteZh: '比波普和冷爵士语汇显示美国爵士在战后欧洲俱乐部和唱片圈的新影响。',
        noteEn: 'Bebop and cool-jazz vocabulary point to the new influence of American jazz in postwar European clubs and records.',
        sourceUrl: 'https://www.loc.gov/research-centers/recorded-sound/collections/',
        rightsLabel: 'Archive gateway reference only',
      }),
    ],
    image: image({
      src: '/images/events/marshall-broadcast.webp',
      altZh: '1947 年马歇尔计划海报',
      altEn: 'A 1947 Marshall Plan poster',
      credit: 'Reyn Dirksen / George C. Marshall Foundation via Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Europe_Plan_Marshall._Poster_1947.JPG',
      licenseLabel: 'Public domain on Wikimedia Commons',
      licenseUrl: commonsLicense,
    }),
  },
  'prc-founding': {
    longDescriptionZh:
      '中华人民共和国成立使中国音乐进入新的国家制度框架。抗战时期形成的群众歌曲、合唱组织、电影歌曲经验和宣传队网络，被重新整合为建国后的公共声音资源。',
    longDescriptionEn:
      'The founding of the People’s Republic of China placed Chinese music inside a new state framework. Wartime mass songs, choral organization, film-song experience, and propaganda troupe networks were reorganized as public sonic resources for the new state.',
    musicImpactZh:
      '音乐从战时救亡转向建国叙事，群众合唱、进行曲、民族化旋律和广播传播成为新公共音乐的核心语法。',
    musicImpactEn:
      'Music shifted from wartime survival to state-building narrative, with mass chorus, march idioms, nationalized melody, and broadcasting becoming the grammar of a new public music.',
    relatedSongs: [
      song({
        title: 'March of the Volunteers',
        performer: 'Nie Er / Tian Han',
        year: '1935 / adopted as anthem in 1949',
        noteZh: '从抗战电影歌曲转化为新国家公共声音，最直接体现战时传统的制度化。',
        noteEn: 'Moved from wartime film song into state public sound, directly showing the institutionalization of wartime tradition.',
        sourceUrl: 'https://link.springer.com/article/10.1186/s41257-026-00150-4',
        rightsLabel: 'Scholarship reference only',
      }),
      song({
        title: 'Yellow River Cantata',
        performer: 'Xian Xinghai / Guang Weiran',
        year: '1939',
        noteZh: '大型合唱传统为建国后公共音乐提供了组织形式和英雄化语言。',
        noteEn: 'Its large choral tradition supplied organizational form and heroic language for post-1949 public music.',
        sourceUrl: 'https://www.icm.gov.mo/ef/news/detail/18214',
        rightsLabel: 'Museum reference only',
      }),
      song({
        title: 'Without the Communist Party There Would Be No New China',
        performer: 'Cao Huoxing',
        year: '1943 / post-1949 circulation',
        noteZh: '战时群众歌曲在建国后获得新的国家叙事位置。',
        noteEn: 'A wartime mass song that gained a new place in post-1949 state narrative.',
        sourceUrl: 'https://link.springer.com/article/10.1186/s41257-026-00150-4',
        rightsLabel: 'Scholarship reference only',
      }),
    ],
    image: image({
      src: '/images/events/prc-founding.webp',
      altZh: '毛泽东在开国大典上宣布中华人民共和国成立',
      altEn: 'Mao Zedong proclaiming the establishment of the People’s Republic of China',
      credit: 'Unknown author / Lehtikuva via Wikimedia Commons',
      sourceUrl: 'https://commons.wikimedia.org/wiki/File:Mao_proclaiming_establishment_of_PRC.jpg',
      licenseLabel: 'Public domain on Wikimedia Commons',
      licenseUrl: commonsLicense,
    }),
  },
}
