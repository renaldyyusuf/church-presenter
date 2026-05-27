import type { VerseResult } from "./bible-verses"
export type { VerseResult }

// Full KJV + TB (Alkitab Terjemahan Baru Indonesia) verse data
const VERSES: VerseResult[] = [
  // ── John / Yohanes ──
  { id:"jn-3-14", book:"John", bookId:"yoh", chapter:3, verse:14, content_kjv:"And as Moses lifted up the serpent in the wilderness, even so must the Son of man be lifted up:", content_tb:"Dan sama seperti Musa meninggikan ular di padang gurun, demikian juga Anak Manusia harus ditinggikan," },
  { id:"jn-3-15", book:"John", bookId:"yoh", chapter:3, verse:15, content_kjv:"That whosoever believeth in him should not perish, but have eternal life.", content_tb:"supaya setiap orang yang percaya kepada-Nya beroleh hidup yang kekal." },
  { id:"jn-3-16", book:"John", bookId:"yoh", chapter:3, verse:16, content_kjv:"For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.", content_tb:"Karena begitu besar kasih Allah akan dunia ini, sehingga Ia telah mengaruniakan Anak-Nya yang tunggal, supaya setiap orang yang percaya kepada-Nya tidak binasa, melainkan beroleh hidup yang kekal." },
  { id:"jn-3-17", book:"John", bookId:"yoh", chapter:3, verse:17, content_kjv:"For God sent not his Son into the world to condemn the world; but that the world through him might be saved.", content_tb:"Sebab Allah mengutus Anak-Nya ke dalam dunia bukan untuk menghakimi dunia, melainkan untuk menyelamatkannya oleh Dia." },
  { id:"jn-14-6", book:"John", bookId:"yoh", chapter:14, verse:6, content_kjv:"Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.", content_tb:"Kata Yesus kepadanya: Akulah jalan dan kebenaran dan hidup. Tidak ada seorangpun yang datang kepada Bapa, kalau tidak melalui Aku." },
  { id:"jn-10-10", book:"John", bookId:"yoh", chapter:10, verse:10, content_kjv:"The thief cometh not, but for to steal, and to kill, and to destroy: I am come that they might have life, and that they might have it more abundantly.", content_tb:"Pencuri datang hanya untuk mencuri dan membunuh dan membinasakan; Aku datang, supaya mereka mempunyai hidup, dan mempunyainya dalam segala kelimpahan." },
  // ── Psalms / Mazmur ──
  { id:"ps-23-1", book:"Psalms", bookId:"mzm", chapter:23, verse:1, content_kjv:"The LORD is my shepherd; I shall not want.", content_tb:"Tuhan adalah gembalaku, takkan kekurangan aku." },
  { id:"ps-23-2", book:"Psalms", bookId:"mzm", chapter:23, verse:2, content_kjv:"He maketh me to lie down in green pastures: he leadeth me beside the still waters.", content_tb:"Ia membaringkan aku di padang yang berumput hijau, Ia membimbing aku ke tepi air yang tenang;" },
  { id:"ps-23-3", book:"Psalms", bookId:"mzm", chapter:23, verse:3, content_kjv:"He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake.", content_tb:"Ia menyegarkan jiwaku. Ia menuntun aku di jalan yang benar oleh karena nama-Nya." },
  { id:"ps-23-4", book:"Psalms", bookId:"mzm", chapter:23, verse:4, content_kjv:"Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me.", content_tb:"Sekalipun aku berjalan dalam lembah kekelaman, aku tidak takut bahaya, sebab Engkau besertaku; gada-Mu dan tongkat-Mu, itulah yang menghibur aku." },
  { id:"ps-23-5", book:"Psalms", bookId:"mzm", chapter:23, verse:5, content_kjv:"Thou preparest a table before me in the presence of mine enemies: thou anointest my head with oil; my cup runneth over.", content_tb:"Engkau menyediakan hidangan bagiku, di hadapan lawanku; Engkau mengurapi kepalaku dengan minyak; pialaku penuh melimpah." },
  { id:"ps-23-6", book:"Psalms", bookId:"mzm", chapter:23, verse:6, content_kjv:"Surely goodness and mercy shall follow me all the days of my life: and I will dwell in the house of the LORD for ever.", content_tb:"Kebajikan dan kemurahan belaka akan mengikuti aku, seumur hidupku; dan aku akan diam dalam rumah Tuhan sepanjang masa." },
  { id:"ps-46-1", book:"Psalms", bookId:"mzm", chapter:46, verse:1, content_kjv:"God is our refuge and strength, a very present help in trouble.", content_tb:"Allah itu bagi kita tempat perlindungan dan kekuatan, sebagai penolong dalam kesesakan sangat terbukti." },
  { id:"ps-121-1", book:"Psalms", bookId:"mzm", chapter:121, verse:1, content_kjv:"I will lift up mine eyes unto the hills, from whence cometh my help.", content_tb:"Aku melayangkan mataku ke gunung-gunung; dari manakah akan datang pertolonganku?" },
  { id:"ps-121-2", book:"Psalms", bookId:"mzm", chapter:121, verse:2, content_kjv:"My help cometh from the LORD, which made heaven and earth.", content_tb:"Pertolonganku ialah dari Tuhan, yang menjadikan langit dan bumi." },
  // ── Romans / Roma ──
  { id:"rom-8-28", book:"Romans", bookId:"rom", chapter:8, verse:28, content_kjv:"And we know that all things work together for good to them that love God, to them who are the called according to his purpose.", content_tb:"Kita tahu sekarang, bahwa Allah turut bekerja dalam segala sesuatu untuk mendatangkan kebaikan bagi mereka yang mengasihi Dia, yaitu bagi mereka yang terpanggil sesuai dengan rencana Allah." },
  { id:"rom-8-37", book:"Romans", bookId:"rom", chapter:8, verse:37, content_kjv:"Nay, in all these things we are more than conquerors through him that loved us.", content_tb:"Tetapi dalam semuanya itu kita lebih dari pada orang-orang yang menang, oleh Dia yang telah mengasihi kita." },
  { id:"rom-8-38", book:"Romans", bookId:"rom", chapter:8, verse:38, content_kjv:"For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come,", content_tb:"Sebab aku yakin, bahwa baik maut, maupun hidup, baik malaikat-malaikat, maupun pemerintah-pemerintah, baik yang ada sekarang, maupun yang akan datang," },
  { id:"rom-8-39", book:"Romans", bookId:"rom", chapter:8, verse:39, content_kjv:"Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.", content_tb:"baik yang di atas, maupun yang di bawah, ataupun sesuatu makhluk lain, tidak akan dapat memisahkan kita dari kasih Allah, yang ada dalam Kristus Yesus, Tuhan kita." },
  // ── Philippians / Filipi ──
  { id:"php-4-6", book:"Philippians", bookId:"flp", chapter:4, verse:6, content_kjv:"Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.", content_tb:"Janganlah hendaknya kamu kuatir tentang apapun juga, tetapi nyatakanlah dalam segala hal keinginanmu kepada Allah dalam doa dan permohonan dengan ucapan syukur." },
  { id:"php-4-7", book:"Philippians", bookId:"flp", chapter:4, verse:7, content_kjv:"And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.", content_tb:"Damai sejahtera Allah, yang melampaui segala akal, akan memelihara hati dan pikiranmu dalam Kristus Yesus." },
  { id:"php-4-13", book:"Philippians", bookId:"flp", chapter:4, verse:13, content_kjv:"I can do all things through Christ which strengtheneth me.", content_tb:"Segala perkara dapat kutanggung di dalam Dia yang memberi kekuatan kepadaku." },
  // ── Isaiah / Yesaya ──
  { id:"isa-40-28", book:"Isaiah", bookId:"yes", chapter:40, verse:28, content_kjv:"Hast thou not known? hast thou not heard, that the everlasting God, the LORD, the Creator of the ends of the earth, fainteth not, neither is weary?", content_tb:"Tidakkah kautahu, dan tidakkah kaudengar? Tuhan ialah Allah kekal yang menciptakan bumi dari ujung ke ujung; Ia tidak menjadi lelah dan tidak menjadi lesu," },
  { id:"isa-40-29", book:"Isaiah", bookId:"yes", chapter:40, verse:29, content_kjv:"He giveth power to the faint; and to them that have no might he increaseth strength.", content_tb:"Dia memberi kekuatan kepada yang lelah dan menambah semangat kepada yang tiada berdaya." },
  { id:"isa-40-31", book:"Isaiah", bookId:"yes", chapter:40, verse:31, content_kjv:"But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.", content_tb:"tetapi orang-orang yang menanti-nantikan Tuhan mendapat kekuatan baru: mereka seumpama rajawali yang naik terbang dengan kekuatan sayapnya; mereka berlari dan tidak menjadi lelah, mereka berjalan dan tidak menjadi lesu." },
  { id:"isa-41-10", book:"Isaiah", bookId:"yes", chapter:41, verse:10, content_kjv:"Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.", content_tb:"janganlah takut, sebab Aku menyertai engkau, janganlah bimbang, sebab Aku ini Allahmu; Aku akan meneguhkan, bahkan akan menolong engkau; Aku akan memegang engkau dengan tangan kanan-Ku yang membawa kemenangan." },
  // ── Matthew / Matius ──
  { id:"mat-5-3", book:"Matthew", bookId:"mat", chapter:5, verse:3, content_kjv:"Blessed are the poor in spirit: for theirs is the kingdom of heaven.", content_tb:"Berbahagialah orang yang miskin di hadapan Allah, karena merekalah yang empunya Kerajaan Sorga." },
  { id:"mat-5-4", book:"Matthew", bookId:"mat", chapter:5, verse:4, content_kjv:"Blessed are they that mourn: for they shall be comforted.", content_tb:"Berbahagialah orang yang berdukacita, karena mereka akan dihibur." },
  { id:"mat-5-5", book:"Matthew", bookId:"mat", chapter:5, verse:5, content_kjv:"Blessed are the meek: for they shall inherit the earth.", content_tb:"Berbahagialah orang yang lemah lembut, karena mereka akan memiliki bumi." },
  { id:"mat-5-6", book:"Matthew", bookId:"mat", chapter:5, verse:6, content_kjv:"Blessed are they which do hunger and thirst after righteousness: for they shall be filled.", content_tb:"Berbahagialah orang yang lapar dan haus akan kebenaran, karena mereka akan dipuaskan." },
  { id:"mat-5-7", book:"Matthew", bookId:"mat", chapter:5, verse:7, content_kjv:"Blessed are the merciful: for they shall obtain mercy.", content_tb:"Berbahagialah orang yang murah hatinya, karena mereka akan beroleh kemurahan." },
  { id:"mat-5-8", book:"Matthew", bookId:"mat", chapter:5, verse:8, content_kjv:"Blessed are the pure in heart: for they shall see God.", content_tb:"Berbahagialah orang yang suci hatinya, karena mereka akan melihat Allah." },
  { id:"mat-6-33", book:"Matthew", bookId:"mat", chapter:6, verse:33, content_kjv:"But seek ye first the kingdom of God, and his righteousness; and all these things shall be added unto you.", content_tb:"Tetapi carilah dahulu Kerajaan Allah dan kebenarannya, maka semuanya itu akan ditambahkan kepadamu." },
  // ── Proverbs / Amsal ──
  { id:"pro-3-5", book:"Proverbs", bookId:"ams", chapter:3, verse:5, content_kjv:"Trust in the LORD with all thine heart; and lean not unto thine own understanding.", content_tb:"Percayalah kepada Tuhan dengan segenap hatimu, dan janganlah bersandar kepada pengertianmu sendiri." },
  { id:"pro-3-6", book:"Proverbs", bookId:"ams", chapter:3, verse:6, content_kjv:"In all thy ways acknowledge him, and he shall direct thy paths.", content_tb:"Akuilah Dia dalam segala lakumu, maka Ia akan meluruskan jalanmu." },
  // ── Jeremiah / Yeremia ──
  { id:"jer-29-11", book:"Jeremiah", bookId:"yer", chapter:29, verse:11, content_kjv:"For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.", content_tb:"Sebab Aku ini mengetahui rancangan-rancangan apa yang ada pada-Ku mengenai kamu, demikianlah firman Tuhan, yaitu rancangan damai sejahtera dan bukan rancangan kecelakaan, untuk memberikan kepadamu hari depan yang penuh harapan." },
  // ── Joshua / Yosua ──
  { id:"jos-1-9", book:"Joshua", bookId:"yos", chapter:1, verse:9, content_kjv:"Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.", content_tb:"Bukankah telah Kuperintahkan kepadamu: kuatkan dan teguhkanlah hatimu? Janganlah kecut dan tawar hati, sebab Tuhan, Allahmu, menyertai engkau ke manapun engkau pergi." },
  // ── 1 Corinthians / 1 Korintus ──
  { id:"1co-13-4", book:"1 Corinthians", bookId:"1kor", chapter:13, verse:4, content_kjv:"Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up,", content_tb:"Kasih itu sabar; kasih itu murah hati; ia tidak cemburu. Ia tidak memegahkan diri dan tidak sombong." },
  { id:"1co-13-7", book:"1 Corinthians", bookId:"1kor", chapter:13, verse:7, content_kjv:"Beareth all things, believeth all things, hopeth all things, endureth all things.", content_tb:"Ia menutupi segala sesuatu, percaya segala sesuatu, mengharapkan segala sesuatu, sabar menanggung segala sesuatu." },
  { id:"1co-13-13", book:"1 Corinthians", bookId:"1kor", chapter:13, verse:13, content_kjv:"And now abideth faith, hope, charity, these three; but the greatest of these is charity.", content_tb:"Demikianlah tinggal ketiga hal ini, yaitu iman, pengharapan dan kasih, dan yang paling besar di antaranya ialah kasih." },
  // ── Ephesians / Efesus ──
  { id:"eph-2-8", book:"Ephesians", bookId:"ef", chapter:2, verse:8, content_kjv:"For by grace are ye saved through faith; and that not of yourselves: it is the gift of God:", content_tb:"Sebab karena kasih karunia kamu diselamatkan oleh iman; itu bukan hasil usahamu, tetapi pemberian Allah," },
  { id:"eph-3-20", book:"Ephesians", bookId:"ef", chapter:3, verse:20, content_kjv:"Now unto him that is able to do exceeding abundantly above all that we ask or think, according to the power that worketh in us,", content_tb:"Bagi Dialah, yang dapat melakukan jauh lebih banyak dari pada yang kita doakan atau pikirkan, seperti yang ternyata dari kuasa yang bekerja di dalam kita," },
  // ── Revelation / Wahyu ──
  { id:"rev-21-4", book:"Revelation", bookId:"why", chapter:21, verse:4, content_kjv:"And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain:", content_tb:"dan Ia akan menghapus segala air mata dari mata mereka, dan maut tidak akan ada lagi; tidak akan ada lagi perkabungan, atau ratap tangis, atau dukacita," },
  // ── Genesis / Kejadian ──
  { id:"gen-1-1", book:"Genesis", bookId:"kej", chapter:1, verse:1, content_kjv:"In the beginning God created the heaven and the earth.", content_tb:"Pada mulanya Allah menciptakan langit dan bumi." },
]

export interface VerseResult {
  id: string
  book: string
  bookId: string
  chapter: number
  verse: number
  content_kjv: string
  content_tb: string
}

const BOOK_ALIASES: Record<string, string> = {
  // Indonesian
  yoh:"yoh", yohanes:"yoh", mzm:"mzm", mazmur:"mzm", rom:"rom", roma:"rom",
  flp:"flp", filipi:"flp", yes:"yes", yesaya:"yes", mat:"mat", matius:"mat",
  ams:"ams", amsal:"ams", yer:"yer", yeremia:"yer", yos:"yos", yosua:"yos",
  "1kor":"1kor", "1korintus":"1kor", ef:"ef", efesus:"ef", why:"why", wahyu:"why",
  kej:"kej", kejadian:"kej",
  // English
  john:"yoh", jn:"yoh", psalms:"mzm", psalm:"mzm", ps:"mzm",
  romans:"rom", philippians:"flp", php:"flp", isaiah:"yes", isa:"yes",
  matthew:"mat", matt:"mat", proverbs:"ams", prov:"ams", jeremiah:"jer",
  jer:"yer", joshua:"yos", josh:"yos",
  "1corinthians":"1kor","1cor":"1kor","1co":"1kor",
  ephesians:"ef", eph:"ef", revelation:"why", rev:"why",
  genesis:"kej", gen:"kej",
}

function resolveBook(input: string): string | null {
  const key = input.toLowerCase().replace(/\s+/g,"").replace(/\.$/,"")
  return BOOK_ALIASES[key] ?? null
}

function parseRef(q: string): { bookId: string; chapter?: number; verseStart?: number; verseEnd?: number } | null {
  // Match: "Yohanes 3:16", "John 3:16-18", "Mazmur 23", "1 Kor 13:4-13"
  const m = q.trim().match(/^(\d?\s?[a-zA-Z]+(?:\s[a-zA-Z]+)?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?/i)
  if (!m) return null
  const bookId = resolveBook(m[1].trim())
  if (!bookId) return null
  return {
    bookId,
    chapter: parseInt(m[2]),
    verseStart: m[3] ? parseInt(m[3]) : undefined,
    verseEnd: m[4] ? parseInt(m[4]) : undefined,
  }
}

export function searchBible(query: string, translation: "KJV" | "TB" = "TB"): VerseResult[] {
  if (!query.trim()) return []
  const q = query.trim()

  // Reference search first
  const ref = parseRef(q)
  if (ref) {
    return VERSES.filter(v => {
      if (v.bookId !== ref.bookId) return false
      if (ref.chapter && v.chapter !== ref.chapter) return false
      if (ref.verseStart && v.verse < ref.verseStart) return false
      if (ref.verseEnd && v.verse > ref.verseEnd) return false
      if (ref.verseStart && !ref.verseEnd && v.verse !== ref.verseStart) return false
      return true
    })
  }

  // Keyword search in both languages
  const kw = q.toLowerCase().split(/\s+/).filter(w => w.length > 2)
  if (!kw.length) return []
  return VERSES.filter(v => {
    const text = `${v.content_kjv} ${v.content_tb}`.toLowerCase()
    return kw.every(k => text.includes(k))
  }).slice(0, 25)
}
