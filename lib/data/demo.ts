import type { Song } from "@/types"

export const DEMO_SONGS: Song[] = [
  {
    id: "demo-1", title: "Amazing Grace", artist: "John Newton", favorite: true,
    lyrics_raw: `VERSE 1\nAmazing grace how sweet the sound\nThat saved a wretch like me\nI once was lost but now am found\nWas blind but now I see\n\nVERSE 2\n'Twas grace that taught my heart to fear\nAnd grace my fears relieved\nHow precious did that grace appear\nThe hour I first believed\n\nCHORUS\nMy chains are gone I've been set free\nMy God my Savior has ransomed me\nAnd like a flood His mercy reigns\nUnending love amazing grace\n\nVERSE 3\nThe Lord has promised good to me\nHis word my hope secures\nHe will my shield and portion be\nAs long as life endures\n\nBRIDGE\nMy God my Savior has ransomed me\nUnending love amazing grace\nUnending love amazing grace`,
    tags: ["hymn", "grace", "classic"], category: "Hymns",
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "demo-2", title: "How Great Is Our God", artist: "Chris Tomlin", favorite: false,
    lyrics_raw: `VERSE 1\nThe splendor of the King\nClothed in majesty\nLet all the earth rejoice\nAll the earth rejoice\nHe wraps Himself in light\nAnd darkness tries to hide\nAnd trembles at His voice\nTrembles at His voice\n\nCHORUS\nHow great is our God\nSing with me\nHow great is our God\nAnd all will see\nHow great how great is our God\n\nVERSE 2\nAnd age to age He stands\nAnd time is in His hands\nBeginning and the End\nBeginning and the End\nThe Godhead three in one\nFather Spirit Son\nThe Lion and the Lamb\nThe Lion and the Lamb\n\nBRIDGE\nName above all names\nWorthy of all praise\nMy heart will sing\nHow great is our God`,
    tags: ["worship", "praise", "contemporary"], category: "Contemporary",
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "demo-3", title: "What A Beautiful Name", artist: "Hillsong Worship", favorite: true,
    lyrics_raw: `VERSE 1\nYou were the Word at the beginning\nOne with God the Lord Most High\nYour hidden glory in creation\nNow revealed in You our Christ\n\nPRE-CHORUS\nWhat a beautiful name it is\nWhat a beautiful name it is\nThe name of Jesus\n\nCHORUS\nWhat a beautiful name it is\nNothing compares to this\nWhat a beautiful name it is\nThe name of Jesus\n\nVERSE 2\nYou didn't want heaven without us\nSo Jesus You brought heaven down\nMy sin was great Your love was greater\nWhat could separate us now\n\nBRIDGE\nDeath could not hold You\nThe veil tore before You\nYou silenced the boast of sin and grave\nThe heavens are roaring\nThe praise of Your glory\nFor You are raised to life again`,
    tags: ["worship", "jesus", "name"], category: "Contemporary",
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "demo-4", title: "Oceans (Where Feet May Fail)", artist: "Hillsong United", favorite: false,
    lyrics_raw: `VERSE 1\nYou call me out upon the waters\nThe great unknown where feet may fail\nAnd there I find You in the mystery\nIn oceans deep my faith will stand\n\nCHORUS\nAnd I will call upon Your name\nAnd keep my eyes above the waves\nWhen oceans rise my soul will rest\nIn Your embrace for I am Yours\nAnd You are mine\n\nVERSE 2\nYour grace abounds in deepest waters\nYour sovereign hand will be my guide\nWhere feet may fail and fear surrounds me\nYou've never failed and You won't start now\n\nBRIDGE\nSpirit lead me where my trust is without borders\nLet me walk upon the waters\nWherever You would call me\nTake me deeper than my feet could ever wander\nAnd my faith will be made stronger\nIn the presence of my Savior`,
    tags: ["worship", "faith", "spirit"], category: "Contemporary",
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "demo-5", title: "10,000 Reasons (Bless the Lord)", artist: "Matt Redman", favorite: true,
    lyrics_raw: `CHORUS\nBless the Lord O my soul\nO my soul\nWorship His holy name\nSing like never before\nO my soul\nI'll worship Your holy name\n\nVERSE 1\nThe sun comes up it's a new day dawning\nIt's time to sing Your song again\nWhatever may pass and whatever lies before me\nLet me be singing when the evening comes\n\nVERSE 2\nYou're rich in love and You're slow to anger\nYour name is great and Your heart is kind\nFor all Your goodness I will keep on singing\nTen thousand reasons for my heart to find\n\nVERSE 3\nAnd on that day when my strength is failing\nThe end draws near and my time has come\nStill my soul will sing Your praise unending\nTen thousand years and then forevermore`,
    tags: ["worship", "praise", "bless"], category: "Contemporary",
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
  {
    id: "demo-6", title: "Great Are You Lord", artist: "All Sons & Daughters", favorite: false,
    lyrics_raw: `VERSE 1\nYou give life You are love\nYou bring light to the darkness\nYou give hope You restore\nEvery heart that is broken\nAnd great are You Lord\n\nCHORUS\nIt's Your breath in our lungs\nSo we pour out our praise\nWe pour out our praise\nIt's Your breath in our lungs\nSo we pour out our praise to You only\n\nBRIDGE\nAll the earth will shout Your praise\nOur hearts will cry these bones will sing\nGreat are You Lord`,
    tags: ["worship", "praise", "breath"], category: "Contemporary",
    created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
  },
]

export const DEMO_BIBLE_VERSES = [
  { book: "John", chapter: 3, verse: 16, content: "For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life." },
  { book: "John", chapter: 3, verse: 17, content: "For God sent not his Son into the world to condemn the world; but that the world through him might be saved." },
  { book: "Psalms", chapter: 23, verse: 1, content: "The LORD is my shepherd; I shall not want." },
  { book: "Psalms", chapter: 23, verse: 2, content: "He maketh me to lie down in green pastures: he leadeth me beside the still waters." },
  { book: "Psalms", chapter: 23, verse: 3, content: "He restoreth my soul: he leadeth me in the paths of righteousness for his name's sake." },
  { book: "Psalms", chapter: 23, verse: 4, content: "Yea, though I walk through the valley of the shadow of death, I will fear no evil: for thou art with me; thy rod and thy staff they comfort me." },
  { book: "Romans", chapter: 8, verse: 28, content: "And we know that all things work together for good to them that love God, to them who are the called according to his purpose." },
  { book: "Romans", chapter: 8, verse: 38, content: "For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come," },
  { book: "Romans", chapter: 8, verse: 39, content: "Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord." },
  { book: "Philippians", chapter: 4, verse: 13, content: "I can do all things through Christ which strengtheneth me." },
  { book: "Philippians", chapter: 4, verse: 6, content: "Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God." },
  { book: "Philippians", chapter: 4, verse: 7, content: "And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus." },
  { book: "Isaiah", chapter: 40, verse: 28, content: "Hast thou not known? hast thou not heard, that the everlasting God, the LORD, the Creator of the ends of the earth, fainteth not, neither is weary? there is no searching of his understanding." },
  { book: "Isaiah", chapter: 40, verse: 29, content: "He giveth power to the faint; and to them that have no might he increaseth strength." },
  { book: "Isaiah", chapter: 40, verse: 31, content: "But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint." },
  { book: "Matthew", chapter: 5, verse: 3, content: "Blessed are the poor in spirit: for theirs is the kingdom of heaven." },
  { book: "Matthew", chapter: 5, verse: 4, content: "Blessed are they that mourn: for they shall be comforted." },
  { book: "Matthew", chapter: 5, verse: 5, content: "Blessed are the meek: for they shall inherit the earth." },
  { book: "Matthew", chapter: 5, verse: 6, content: "Blessed are they which do hunger and thirst after righteousness: for they shall be filled." },
  { book: "Matthew", chapter: 5, verse: 7, content: "Blessed are the merciful: for they shall obtain mercy." },
  { book: "Matthew", chapter: 5, verse: 8, content: "Blessed are the pure in heart: for they shall see God." },
  { book: "Proverbs", chapter: 3, verse: 5, content: "Trust in the LORD with all thine heart; and lean not unto thine own understanding." },
  { book: "Proverbs", chapter: 3, verse: 6, content: "In all thy ways acknowledge him, and he shall direct thy paths." },
  { book: "Joshua", chapter: 1, verse: 9, content: "Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest." },
  { book: "Jeremiah", chapter: 29, verse: 11, content: "For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end." },
]
