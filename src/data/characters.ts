export type FormEntry = {
  title: string
  description: string
  difficulty?: "basic" | "advanced" | "master"
}

export type ThemeMotion = "calm" | "aggressive" | "chaotic" | "heavy"
export type ThemeVfx = "flame" | "water" | "mist" | "lightning" | "shadow" | "ice" | "blood"

export type CharacterTheme = {
  primaryGlow: string
  secondaryGlow: string
  bg: [string, string, string]
  vfx: ThemeVfx
  motion: ThemeMotion
}

export type Character = {
  slug: string
  name: string
  faction: "corps" | "hashira" | "demon"
  rank: "Hashira" | "Corps" | "Demon" | `Upper Moon ${1 | 2 | 3 | 4 | 5 | 6}` | `Lower Moon ${1 | 2 | 3 | 4 | 5 | 6}`
  power: {
    breathingStyle?: string
    bloodDemonArt?: string
  }
  forms: FormEntry[]
  powerReveal: string[]
  tags: string[]
  description: string
  theme: CharacterTheme
  images: {
    posterUrl: string
    galleryUrls: string[]
  }
}

type RawTheme = Pick<CharacterTheme, "primaryGlow" | "secondaryGlow"> &
  Partial<Pick<CharacterTheme, "bg" | "vfx" | "motion">>

type RawCharacter = Omit<Character, "theme"> & {
  theme: RawTheme
}

const resolveVfx = (character: RawCharacter): ThemeVfx => {
  if (character.theme.vfx) {
    return character.theme.vfx
  }
  const source = `${character.power.breathingStyle ?? ""} ${character.power.bloodDemonArt ?? ""} ${character.tags.join(" ")}`
    .toLowerCase()
    .trim()
  if (source.includes("water")) {
    return "water"
  }
  if (source.includes("flame") || source.includes("hinokami") || source.includes("fire")) {
    return "flame"
  }
  if (source.includes("thunder") || source.includes("lightning")) {
    return "lightning"
  }
  if (source.includes("mist")) {
    return "mist"
  }
  if (source.includes("shadow") || source.includes("moon")) {
    return "shadow"
  }
  if (source.includes("ice")) {
    return "ice"
  }
  if (source.includes("blood")) {
    return "blood"
  }
  return "mist"
}

const resolveMotion = (character: RawCharacter): ThemeMotion => {
  if (character.theme.motion) {
    return character.theme.motion
  }
  if (character.faction === "demon") {
    return "chaotic"
  }
  if (character.faction === "hashira") {
    return "aggressive"
  }
  return "calm"
}

const resolveTheme = (character: RawCharacter): CharacterTheme => {
  const primaryGlow = character.theme.primaryGlow
  const secondaryGlow = character.theme.secondaryGlow
  const bg = character.theme.bg ?? [primaryGlow, secondaryGlow, "#0b1120"]
  return {
    primaryGlow,
    secondaryGlow,
    bg,
    vfx: resolveVfx(character),
    motion: resolveMotion(character),
  }
}

const baseGallery = ["/characters/placeholder.svg", "/characters/placeholder.svg", "/characters/placeholder.svg"]

const baseImages = {
  posterUrl: "/characters/placeholder.svg",
  galleryUrls: baseGallery,
}

const rawCharacters: RawCharacter[] = [
  {
    slug: "tanjiro-kamado",
    name: "Tanjiro Kamado",
    faction: "corps",
    rank: "Corps",
    power: { breathingStyle: "Water Breathing / Hinokami Kagura" },
    forms: [
      { title: "First Form: Water Surface Slash", description: "A precise opening strike with flowing control.", difficulty: "basic" },
      { title: "Tenth Form: Constant Flux", description: "A continuous spiral that escalates momentum.", difficulty: "advanced" },
      { title: "Hinokami: Dance", description: "A blazing kata passed down through the Kamado line.", difficulty: "master" },
    ],
    powerReveal: ["Adaptive swordplay", "High empathy tracking", "Sun Breathing legacy", "Precision footwork"],
    tags: ["Demon Slayer Corps", "Water Breathing", "Hinokami"],
    description:
      "A compassionate swordsman who carries his family’s memory into every battle. His resolve burns with a rare mix of mercy and relentless focus.",
    theme: { primaryGlow: "#22d3ee", secondaryGlow: "#f97316" },
    images: { posterUrl: "/characters/tanjiro-kamado.jpg", galleryUrls: baseGallery },
  },
  {
    slug: "nezuko-kamado",
    name: "Nezuko Kamado",
    faction: "corps",
    rank: "Corps",
    power: { bloodDemonArt: "Exploding Blood" },
    forms: [
      { title: "Burst Ignition", description: "Ignites her blood to counter demon arts.", difficulty: "advanced" },
      { title: "Regenerative Surge", description: "Rapid recovery that sustains prolonged combat.", difficulty: "master" },
    ],
    powerReveal: ["Explosive blood art", "Sunlight resistance", "Protective instincts", "Unusual demon resilience"],
    tags: ["Main Cast", "Blood Demon Art", "Sun Resistance"],
    description:
      "A demon who guards her humanity with unbreakable will. Nezuko’s quiet presence hides a fierce protective spirit.",
    theme: { primaryGlow: "#f472b6", secondaryGlow: "#f59e0b" },
    images: {
      posterUrl: "/characters/nezuko-kamado.jpg",
      galleryUrls: baseGallery,
    },
  },
  {
    slug: "zenitsu-agatsuma",
    name: "Zenitsu Agatsuma",
    faction: "corps",
    rank: "Corps",
    power: { breathingStyle: "Thunder Breathing" },
    forms: [
      { title: "First Form: Thunderclap and Flash", description: "A lightning-quick dash strike.", difficulty: "basic" },
      { title: "Sixfold", description: "Multiple chained flashes in a single breath.", difficulty: "advanced" },
      { title: "Godspeed", description: "An extreme burst that trades control for speed.", difficulty: "master" },
    ],
    powerReveal: ["Explosive dash speed", "Single-form mastery", "Instant draw", "Combat focus under pressure"],
    tags: ["Demon Slayer Corps", "Thunder Breathing"],
    description:
      "A nervous swordsman who becomes lightning when the moment calls. Zenitsu’s speed strikes before fear can catch him.",
    theme: { primaryGlow: "#facc15", secondaryGlow: "#38bdf8" },
    images: {
      posterUrl: "/characters/zenitsu-agatsuma.jpg",
      galleryUrls: baseGallery,
    },
  },
  {
    slug: "inosuke-hashibira",
    name: "Inosuke Hashibira",
    faction: "corps",
    rank: "Corps",
    power: { breathingStyle: "Beast Breathing" },
    forms: [
      { title: "First Fang: Pierce", description: "Straight thrust with feral accuracy.", difficulty: "basic" },
      { title: "Fifth Fang: Crazy Cutting", description: "Wild multi-directional slashes.", difficulty: "advanced" },
      { title: "Seventh Fang: Spatial Awareness", description: "A sensory read of enemy position.", difficulty: "master" },
    ],
    powerReveal: ["Feral agility", "Dual blades", "Instinctive counters", "Unorthodox breathing"],
    tags: ["Demon Slayer Corps", "Beast Breathing"],
    description:
      "A wild fighter raised in the mountains with razor instincts. Inosuke charges into danger with fearless confidence.",
    theme: { primaryGlow: "#38bdf8", secondaryGlow: "#a3e635" },
    images: {
      posterUrl: "/characters/inosuke-hashibira.jpg",
      galleryUrls: baseGallery,
    },
  },
  {
    slug: "kanao-tsuyuri",
    name: "Kanao Tsuyuri",
    faction: "corps",
    rank: "Corps",
    power: { breathingStyle: "Flower Breathing" },
    forms: [
      { title: "Second Form: Honorable Shadow Plum", description: "Balanced slashes with grounded poise.", difficulty: "basic" },
      { title: "Sixth Form: Whirling Peach", description: "Circular defense into counterstrike.", difficulty: "advanced" },
      { title: "Final Form: Equinoctial Vermilion Eye", description: "Extreme perception at a physical cost.", difficulty: "master" },
    ],
    powerReveal: ["Refined precision", "Explosive speed", "Optical focus", "Silent movement"],
    tags: ["Demon Slayer Corps", "Flower Breathing"],
    description:
      "A calm and disciplined swordswoman guided by sharp perception. Kanao’s precision is effortless and measured.",
    theme: { primaryGlow: "#fb7185", secondaryGlow: "#f472b6" },
    images: baseImages,
  },
  {
    slug: "genya-shinazugawa",
    name: "Genya Shinazugawa",
    faction: "corps",
    rank: "Corps",
    power: { breathingStyle: "Gun Breathing Hybrid" },
    forms: [
      { title: "Nichirin Shot", description: "Close-range blast synchronized with breathing.", difficulty: "basic" },
      { title: "Demon Assimilation", description: "Temporarily gains demonic traits.", difficulty: "advanced" },
    ],
    powerReveal: ["Demon trait absorption", "Firearms mastery", "Endurance under stress", "Close-range bursts"],
    tags: ["Demon Slayer Corps", "Hybrid Style"],
    description:
      "A fierce fighter who bends the rules to survive. Genya’s strength is earned through pain and persistence.",
    theme: { primaryGlow: "#94a3b8", secondaryGlow: "#f97316" },
    images: baseImages,
  },
  {
    slug: "giyu-tomioka",
    name: "Giyu Tomioka",
    faction: "hashira",
    rank: "Hashira",
    power: { breathingStyle: "Water Breathing" },
    forms: [
      { title: "Eleventh Form: Dead Calm", description: "A total nullification of incoming strikes.", difficulty: "master" },
      { title: "Second Form: Water Wheel", description: "A spiraling vertical slash.", difficulty: "advanced" },
    ],
    powerReveal: ["Perfect defensive timing", "Fluid counters", "Silent precision", "Hashira-level stamina"],
    tags: ["Hashira", "Water Breathing"],
    description:
      "A stoic swordsman whose silence speaks volumes. Giyu’s control flows like a quiet river.",
    theme: { primaryGlow: "#60a5fa", secondaryGlow: "#22d3ee" },
    images: baseImages,
  },
  {
    slug: "shinobu-kocho",
    name: "Shinobu Kocho",
    faction: "hashira",
    rank: "Hashira",
    power: { breathingStyle: "Insect Breathing" },
    forms: [
      { title: "Butterfly Dance: Caprice", description: "A swift thrust with piercing poison.", difficulty: "basic" },
      { title: "Dance of the Bee Sting", description: "Consecutive stabs to deliver toxin.", difficulty: "advanced" },
    ],
    powerReveal: ["Poisoned blade", "Swift thrusts", "Medical precision", "Aerial footwork"],
    tags: ["Hashira", "Insect Breathing"],
    description:
      "A graceful warrior whose smile hides a razor edge. Shinobu’s poison craft is precise and deadly.",
    theme: { primaryGlow: "#c084fc", secondaryGlow: "#22d3ee" },
    images: baseImages,
  },
  {
    slug: "kyojuro-rengoku",
    name: "Kyojuro Rengoku",
    faction: "hashira",
    rank: "Hashira",
    power: { breathingStyle: "Flame Breathing" },
    forms: [
      { title: "First Form: Unknowing Fire", description: "A straight slash with searing force.", difficulty: "basic" },
      { title: "Ninth Form: Rengoku", description: "A blazing charge that engulfs the field.", difficulty: "master" },
    ],
    powerReveal: ["Explosive offense", "Unbreakable morale", "High-impact slashes", "Fire aura intensity"],
    tags: ["Hashira", "Flame Breathing"],
    description:
      "A blazing pillar of optimism and strength. Rengoku fights with radiant conviction.",
    theme: { primaryGlow: "#f97316", secondaryGlow: "#facc15" },
    images: baseImages,
  },
  {
    slug: "tengen-uzui",
    name: "Tengen Uzui",
    faction: "hashira",
    rank: "Hashira",
    power: { breathingStyle: "Sound Breathing" },
    forms: [
      { title: "Fourth Form: Constant Resounding Slashes", description: "Explosive dual-blade rhythm.", difficulty: "advanced" },
      { title: "Fifth Form: String Performance", description: "A sweeping bombardment of strikes.", difficulty: "master" },
    ],
    powerReveal: ["Explosive techniques", "Rhythmic combat", "Dual blades", "High endurance"],
    tags: ["Hashira", "Sound Breathing"],
    description:
      "A flamboyant warrior who turns battle into performance. Tengen’s rhythm creates thunderous spectacle.",
    theme: { primaryGlow: "#f472b6", secondaryGlow: "#38bdf8" },
    images: baseImages,
  },
  {
    slug: "mitsuri-kanroji",
    name: "Mitsuri Kanroji",
    faction: "hashira",
    rank: "Hashira",
    power: { breathingStyle: "Love Breathing" },
    forms: [
      { title: "First Form: Shivers of First Love", description: "A whip-like slash with flexible arcs.", difficulty: "basic" },
      { title: "Sixth Form: Cat-Legged Winds of Love", description: "A swirling barrage of strikes.", difficulty: "advanced" },
    ],
    powerReveal: ["Extraordinary strength", "Whip sword control", "Warm-hearted defense", "Rapid rotation"],
    tags: ["Hashira", "Love Breathing"],
    description:
      "A warm-hearted fighter with unmatched physical strength. Mitsuri’s flexible style is graceful yet devastating.",
    theme: { primaryGlow: "#f472b6", secondaryGlow: "#fcd34d" },
    images: baseImages,
  },
  {
    slug: "muichiro-tokito",
    name: "Muichiro Tokito",
    faction: "hashira",
    rank: "Hashira",
    power: { breathingStyle: "Mist Breathing" },
    forms: [
      { title: "Seventh Form: Obscuring Clouds", description: "Creates a disorienting veil.", difficulty: "advanced" },
      { title: "Eighth Form: Drifting Clouds", description: "Swift, vanishing slashes.", difficulty: "master" },
    ],
    powerReveal: ["Mist concealment", "Prodigy reflexes", "Silent strike", "Elegant evasion"],
    tags: ["Hashira", "Mist Breathing"],
    description:
      "A prodigy whose calm mind hides a sharp edge. Muichiro drifts through combat like mist.",
    theme: { primaryGlow: "#a5f3fc", secondaryGlow: "#818cf8" },
    images: baseImages,
  },
  {
    slug: "sanemi-shinazugawa",
    name: "Sanemi Shinazugawa",
    faction: "hashira",
    rank: "Hashira",
    power: { breathingStyle: "Wind Breathing" },
    forms: [
      { title: "First Form: Dust Whirlwind Cutter", description: "A sweeping gale of blades.", difficulty: "basic" },
      { title: "Fifth Form: Cold Mountain Wind", description: "A dense, crushing cyclone.", difficulty: "advanced" },
    ],
    powerReveal: ["Violent wind slashes", "Aggressive pressure", "High stamina", "Unyielding grit"],
    tags: ["Hashira", "Wind Breathing"],
    description:
      "A fierce warrior with a tempestuous spirit. Sanemi’s strikes are wild and unrelenting.",
    theme: { primaryGlow: "#84cc16", secondaryGlow: "#22d3ee" },
    images: baseImages,
  },
  {
    slug: "gyomei-himejima",
    name: "Gyomei Himejima",
    faction: "hashira",
    rank: "Hashira",
    power: { breathingStyle: "Stone Breathing" },
    forms: [
      { title: "First Form: Serpentinite Bipolar", description: "A crushing flail-and-axe swing.", difficulty: "advanced" },
      { title: "Fifth Form: Arcs of Justice", description: "Massive arcs with grounded power.", difficulty: "master" },
    ],
    powerReveal: ["Absolute strength", "Chain weapon mastery", "Unshakable defense", "Faith-driven focus"],
    tags: ["Hashira", "Stone Breathing"],
    description:
      "The strongest Hashira with a gentle soul. Gyomei’s presence is a calm, immovable force.",
    theme: { primaryGlow: "#fbbf24", secondaryGlow: "#64748b" },
    images: baseImages,
  },
  {
    slug: "obanai-iguro",
    name: "Obanai Iguro",
    faction: "hashira",
    rank: "Hashira",
    power: { breathingStyle: "Serpent Breathing" },
    forms: [
      { title: "Second Form: Slithering Snake", description: "Unpredictable, coiling strikes.", difficulty: "advanced" },
      { title: "Fifth Form: Winding Serpent Slash", description: "A precision finisher with coils.", difficulty: "master" },
    ],
    powerReveal: ["Serpentine precision", "Tight control", "Adaptive angles", "Focused guard"],
    tags: ["Hashira", "Serpent Breathing"],
    description:
      "A vigilant swordsman whose precision is serpent-like. Obanai’s blade weaves with unnerving accuracy.",
    theme: { primaryGlow: "#22c55e", secondaryGlow: "#10b981" },
    images: baseImages,
  },
  {
    slug: "muzan-kibutsuji",
    name: "Muzan Kibutsuji",
    faction: "demon",
    rank: "Demon",
    power: { bloodDemonArt: "Biokinesis" },
    forms: [
      { title: "Whip Manifestation", description: "Creates lethal, shifting tendrils.", difficulty: "advanced" },
      { title: "Cellular Regeneration", description: "Regenerates at a terrifying speed.", difficulty: "master" },
    ],
    powerReveal: ["Master of demon blood", "Rapid regeneration", "Fear aura", "Total control"],
    tags: ["Demon", "Supreme"],
    description:
      "The origin of all demons, poised and ruthless. Muzan’s power is cold, calculating, and absolute.",
    theme: { primaryGlow: "#ef4444", secondaryGlow: "#111827" },
    images: baseImages,
  },
  {
    slug: "kokushibo",
    name: "Kokushibo",
    faction: "demon",
    rank: "Upper Moon 1",
    power: { bloodDemonArt: "Moon Breathing" },
    forms: [
      { title: "Crescent Blades", description: "Moon-shaped slashes at range.", difficulty: "advanced" },
      { title: "Eternal Night", description: "Endless overlapping crescents.", difficulty: "master" },
    ],
    powerReveal: ["Six-eyed perception", "Moon blade waves", "Swordsman mastery", "Ancient experience"],
    tags: ["Upper Moon", "Moon Breathing"],
    description:
      "An ancient swordsman with eyes like a night sky. Kokushibo’s technique is layered and haunting.",
    theme: { primaryGlow: "#6366f1", secondaryGlow: "#0ea5e9" },
    images: baseImages,
  },
  {
    slug: "doma",
    name: "Doma",
    faction: "demon",
    rank: "Upper Moon 2",
    power: { bloodDemonArt: "Cryokinesis" },
    forms: [
      { title: "Lotus Ice Garden", description: "A freezing field of lethal petals.", difficulty: "advanced" },
      { title: "Frozen Puppets", description: "Creates icy constructs to overwhelm.", difficulty: "master" },
    ],
    powerReveal: ["Deadly ice art", "Deceptive charm", "Wide-area control", "Rapid creation"],
    tags: ["Upper Moon", "Ice Art"],
    description:
      "Charming and cold, Doma’s smile hides brutal intent. His ice creations are beautiful and lethal.",
    theme: { primaryGlow: "#38bdf8", secondaryGlow: "#a5f3fc" },
    images: baseImages,
  },
  {
    slug: "akaza",
    name: "Akaza",
    faction: "demon",
    rank: "Upper Moon 3",
    power: { bloodDemonArt: "Destructive Death" },
    forms: [
      { title: "Air Type", description: "Shockwaves that crush from range.", difficulty: "advanced" },
      { title: "Annihilation Type", description: "A peak burst of martial power.", difficulty: "master" },
    ],
    powerReveal: ["Martial dominance", "Combat compass", "Regenerative stamina", "Relentless pressure"],
    tags: ["Upper Moon", "Martial Arts"],
    description:
      "A warrior who respects strength above all else. Akaza’s strikes are heavy, rhythmic, and relentless.",
    theme: { primaryGlow: "#22d3ee", secondaryGlow: "#7c3aed" },
    images: baseImages,
  },
  {
    slug: "hantengu",
    name: "Hantengu",
    faction: "demon",
    rank: "Upper Moon 4",
    power: { bloodDemonArt: "Emotion Manifestation" },
    forms: [
      { title: "Sekido", description: "Thunder fury incarnation.", difficulty: "advanced" },
      { title: "Zohakuten", description: "Composite rage with wooden dragons.", difficulty: "master" },
    ],
    powerReveal: ["Multiple clones", "Elemental wrath", "Chaos pressure", "Unstable menace"],
    tags: ["Upper Moon", "Emotion Clones"],
    description:
      "A timid facade hides a terrifying power. Hantengu fractures into raging emotions that overwhelm.",
    theme: { primaryGlow: "#a855f7", secondaryGlow: "#f97316" },
    images: baseImages,
  },
  {
    slug: "gyokko",
    name: "Gyokko",
    faction: "demon",
    rank: "Upper Moon 5",
    power: { bloodDemonArt: "Vase Manipulation" },
    forms: [
      { title: "Vase Transit", description: "Teleports through ceramic portals.", difficulty: "advanced" },
      { title: "Final Form", description: "A transformed body with lethal scales.", difficulty: "master" },
    ],
    powerReveal: ["Warped space travel", "Poisoned slashes", "Unnerving mobility", "Grotesque artistry"],
    tags: ["Upper Moon", "Vase Art"],
    description:
      "A grotesque artist who twists beauty into terror. Gyokko’s movements are slippery and surreal.",
    theme: { primaryGlow: "#14b8a6", secondaryGlow: "#0ea5e9" },
    images: baseImages,
  },
  {
    slug: "daki",
    name: "Daki",
    faction: "demon",
    rank: "Upper Moon 6",
    power: { bloodDemonArt: "Obi Sashes" },
    forms: [
      { title: "Ribbon Slash", description: "Rapid, razor-thin sash strikes.", difficulty: "basic" },
      { title: "Multi-Obi Bind", description: "Constriction with layered sashes.", difficulty: "advanced" },
    ],
    powerReveal: ["Long-range sashes", "Elegant cruelty", "Binding control", "Flashy offense"],
    tags: ["Upper Moon", "Obi Art"],
    description:
      "A demon who wields beauty like a blade. Daki’s sashes strike with swift, elegant cruelty.",
    theme: { primaryGlow: "#f472b6", secondaryGlow: "#8b5cf6" },
    images: baseImages,
  },
  {
    slug: "gyutaro",
    name: "Gyutaro",
    faction: "demon",
    rank: "Upper Moon 6",
    power: { bloodDemonArt: "Blood Sickles" },
    forms: [
      { title: "Blood Crescent", description: "Curved blades with poisonous blood.", difficulty: "advanced" },
      { title: "Rotting Sickle Dance", description: "A wild chain of lethal swings.", difficulty: "master" },
    ],
    powerReveal: ["Poisoned strikes", "Frenzied tempo", "Linked survival", "Harsh resilience"],
    tags: ["Upper Moon", "Blood Weapons"],
    description:
      "A bitter fighter whose blades drip with poison. Gyutaro’s attacks are jagged and relentless.",
    theme: { primaryGlow: "#22c55e", secondaryGlow: "#0f172a" },
    images: baseImages,
  },
  {
    slug: "kaigaku",
    name: "Kaigaku",
    faction: "demon",
    rank: "Upper Moon 6",
    power: { bloodDemonArt: "Corrupted Thunder Breathing" },
    forms: [
      { title: "Lightning Discharge", description: "Darkened thunder slashes.", difficulty: "advanced" },
      { title: "Black Thunder Swarm", description: "A barrage of corrupted arcs.", difficulty: "master" },
    ],
    powerReveal: ["Corrupted thunder", "Aggressive strikes", "Demon speed", "Ambition-fueled power"],
    tags: ["Upper Moon", "Thunder Breathing"],
    description:
      "A fallen swordsman who traded honor for power. Kaigaku’s lightning is sharp and unforgiving.",
    theme: { primaryGlow: "#eab308", secondaryGlow: "#0ea5e9" },
    images: baseImages,
  },
  {
    slug: "nakime",
    name: "Nakime",
    faction: "demon",
    rank: "Upper Moon 4",
    power: { bloodDemonArt: "Biwa Manipulation" },
    forms: [
      { title: "Infinity Castle Shift", description: "Repositions space at will.", difficulty: "advanced" },
      { title: "Spatial Collapse", description: "Crushes opponents with shifting terrain.", difficulty: "master" },
    ],
    powerReveal: ["Spatial control", "Silent presence", "Battlefield dominance", "Instant relocation"],
    tags: ["Upper Moon", "Biwa Art"],
    description:
      "A silent demon who controls space with a single chord. Nakime’s biwa bends the battlefield.",
    theme: { primaryGlow: "#6366f1", secondaryGlow: "#0f172a" },
    images: baseImages,
  },
  {
    slug: "rui",
    name: "Rui",
    faction: "demon",
    rank: "Lower Moon 5",
    power: { bloodDemonArt: "Thread Manipulation" },
    forms: [
      { title: "Cutting Thread Cage", description: "A web of slicing threads.", difficulty: "advanced" },
      { title: "Family Puppet Strings", description: "Controls targets like marionettes.", difficulty: "master" },
    ],
    powerReveal: ["Razor threads", "Precision traps", "Cocoon defense", "Cold focus"],
    tags: ["Lower Moon", "Thread Art"],
    description:
      "A demon who seeks family through control. Rui’s threads cut with terrifying precision.",
    theme: { primaryGlow: "#f472b6", secondaryGlow: "#60a5fa" },
    images: baseImages,
  },
  {
    slug: "enmu",
    name: "Enmu",
    faction: "demon",
    rank: "Lower Moon 1",
    power: { bloodDemonArt: "Dream Manipulation" },
    forms: [
      { title: "Sleep Induction", description: "Sends targets into dream state.", difficulty: "basic" },
      { title: "Nightmare Domination", description: "Controls and weaponizes dreams.", difficulty: "advanced" },
    ],
    powerReveal: ["Sleep control", "Dream traps", "Psychological warfare", "Illusory stealth"],
    tags: ["Lower Moon", "Dream Art"],
    description:
      "A demon who feeds on nightmares and control. Enmu thrives in the space between sleep and fear.",
    theme: { primaryGlow: "#f97316", secondaryGlow: "#334155" },
    images: baseImages,
  },
  {
    slug: "susamaru",
    name: "Susamaru",
    faction: "demon",
    rank: "Demon",
    power: { bloodDemonArt: "Temari Assault" },
    forms: [
      { title: "Temari Barrage", description: "Rapid strikes with rotating temari.", difficulty: "advanced" },
    ],
    powerReveal: ["High-speed throws", "Explosive ricochets", "Endless stamina", "Playful brutality"],
    tags: ["Demon", "Temari"],
    description:
      "A demon who attacks with relentless, spinning force. Susamaru’s strikes are playful but deadly.",
    theme: { primaryGlow: "#f472b6", secondaryGlow: "#a855f7" },
    images: baseImages,
  },
  {
    slug: "yahaba",
    name: "Yahaba",
    faction: "demon",
    rank: "Demon",
    power: { bloodDemonArt: "Vector Arrows" },
    forms: [
      { title: "Directional Control", description: "Redirects motion with arrow vectors.", difficulty: "advanced" },
    ],
    powerReveal: ["Trajectory manipulation", "Forced movement", "Strategic control", "Cold precision"],
    tags: ["Demon", "Vector Art"],
    description:
      "A demon who manipulates direction with a single glance. Yahaba’s attacks feel unavoidable.",
    theme: { primaryGlow: "#22d3ee", secondaryGlow: "#0f172a" },
    images: baseImages,
  },
  {
    slug: "sabito",
    name: "Sabito",
    faction: "corps",
    rank: "Corps",
    power: { breathingStyle: "Water Breathing" },
    forms: [
      { title: "Flowing Slash", description: "Training-focused technique with clean arcs.", difficulty: "basic" },
      { title: "Waterfall Cut", description: "A weighty vertical strike.", difficulty: "advanced" },
    ],
    powerReveal: ["Mentor discipline", "Clean technique", "Strong resolve", "Protective instinct"],
    tags: ["Demon Slayer Corps", "Mentor"],
    description:
      "A fierce yet kind swordsman who shaped Tanjiro’s resolve. Sabito’s spirit lingers in every lesson.",
    theme: { primaryGlow: "#38bdf8", secondaryGlow: "#64748b" },
    images: baseImages,
  },
  {
    slug: "makomo",
    name: "Makomo",
    faction: "corps",
    rank: "Corps",
    power: { breathingStyle: "Water Breathing" },
    forms: [
      { title: "Calm Tide", description: "A gentle approach with precise timing.", difficulty: "basic" },
    ],
    powerReveal: ["Calm insight", "Guiding mentor", "Balanced technique", "Steady presence"],
    tags: ["Demon Slayer Corps", "Mentor"],
    description:
      "A gentle guide whose insights are sharp and clear. Makomo brings calm and clarity to the harsh training.",
    theme: { primaryGlow: "#fda4af", secondaryGlow: "#60a5fa" },
    images: baseImages,
  },
  {
    slug: "aoi-kanzaki",
    name: "Aoi Kanzaki",
    faction: "corps",
    rank: "Corps",
    power: { breathingStyle: "Medical Support" },
    forms: [
      { title: "Treatment Protocols", description: "Expert care in the Butterfly Estate.", difficulty: "basic" },
    ],
    powerReveal: ["Medical expertise", "Disciplined support", "Logistics mastery", "Calm under pressure"],
    tags: ["Corps Support", "Butterfly Estate"],
    description:
      "A strict caretaker who keeps the Corps grounded. Aoi’s discipline protects those who need recovery.",
    theme: { primaryGlow: "#60a5fa", secondaryGlow: "#f472b6" },
    images: baseImages,
  },
  {
    slug: "murata",
    name: "Murata",
    faction: "corps",
    rank: "Corps",
    power: { breathingStyle: "Water Breathing" },
    forms: [
      { title: "Standard Form", description: "Dependable, disciplined strokes.", difficulty: "basic" },
    ],
    powerReveal: ["Dependable fighter", "Solid form", "Survivor instinct", "Reliable teammate"],
    tags: ["Demon Slayer Corps"],
    description:
      "A dependable slayer who survives through grit and focus. Murata’s perseverance keeps him moving forward.",
    theme: { primaryGlow: "#94a3b8", secondaryGlow: "#38bdf8" },
    images: baseImages,
  },
  {
    slug: "kagaya-ubuyashiki",
    name: "Kagaya Ubuyashiki",
    faction: "corps",
    rank: "Corps",
    power: { breathingStyle: "Strategic Leadership" },
    forms: [
      { title: "Corps Directive", description: "Orchestrates the Corps with clear guidance.", difficulty: "advanced" },
    ],
    powerReveal: ["Visionary leadership", "Tactical insight", "Calming presence", "Unifying command"],
    tags: ["Corps Leader", "Strategist"],
    description:
      "The gentle leader whose vision guides the Corps. Kagaya’s calm words carry immense strength.",
    theme: { primaryGlow: "#e2e8f0", secondaryGlow: "#94a3b8" },
    images: baseImages,
  },
  {
    slug: "amane-ubuyashiki",
    name: "Amane Ubuyashiki",
    faction: "corps",
    rank: "Corps",
    power: { breathingStyle: "Operational Support" },
    forms: [
      { title: "Mission Coordination", description: "Ensures steady, reliable operations.", difficulty: "basic" },
    ],
    powerReveal: ["Calm coordination", "Support leadership", "Operational clarity", "Steady resolve"],
    tags: ["Corps Support"],
    description:
      "A composed presence who steadies the Corps. Amane’s clarity keeps the mission focused.",
    theme: { primaryGlow: "#f9a8d4", secondaryGlow: "#cbd5f5" },
    images: baseImages,
  },
  {
    slug: "tamayo",
    name: "Tamayo",
    faction: "corps",
    rank: "Corps",
    power: { bloodDemonArt: "Medical Transformation" },
    forms: [
      { title: "Demon Conversion", description: "Transforms wounds with medical precision.", difficulty: "advanced" },
      { title: "Aromatic Suppression", description: "Neutralizes demon powers with drugs.", difficulty: "master" },
    ],
    powerReveal: ["Medical genius", "Anti-demon serums", "Calm analysis", "Supportive combat"],
    tags: ["Demon Ally", "Medicine"],
    description:
      "A demon who turned against Muzan through science and compassion. Tamayo’s knowledge is vast.",
    theme: { primaryGlow: "#f472b6", secondaryGlow: "#60a5fa" },
    images: baseImages,
  },
  {
    slug: "yushiro",
    name: "Yushiro",
    faction: "corps",
    rank: "Corps",
    power: { bloodDemonArt: "Illusion Weaving" },
    forms: [
      { title: "Hidden Art: Conceal", description: "Erases presence with illusion.", difficulty: "advanced" },
      { title: "Visual Mask", description: "Distorts perception of allies.", difficulty: "advanced" },
    ],
    powerReveal: ["Illusion support", "Protective loyalty", "Perception control", "Stealth aid"],
    tags: ["Demon Ally", "Illusion Art"],
    description:
      "A loyal guardian with sharp senses and fierce devotion. Yushiro’s art bends perception.",
    theme: { primaryGlow: "#22c55e", secondaryGlow: "#0ea5e9" },
    images: baseImages,
  },
]

export const characters: Character[] = rawCharacters.map((character) => ({
  ...character,
  theme: resolveTheme(character),
}))
