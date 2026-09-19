// ─────────────────────────────────────────────────────────────────────────────
//  THE ONLY FILE YOU NEED TO EDIT.
//  Everything the site says lives here. Change a string, the site changes.
//  Add an object to `projects` and it appears in the index, the drag-grid,
//  the counter and gets its own page automatically.
// ─────────────────────────────────────────────────────────────────────────────

export const identity = {
  name: 'Rishik Rontala',
  wordmark: 'RR',
  // Hero headline, one word per line. Keep it short — it is set enormous.
  headline: ['Rishik', 'Rontala'],
  discipline: 'Computer Science & Artificial Intelligence',
  // The one sentence that has to land.
  proposition:
    'I build systems that try to read the parts of people that resist being formalised.',
  location: 'United States',
  timezone: 'America/New_York',
  email: 'rishikrrontala@gmail.com',
  availability: 'Open to internships, research and hackathon teams — 2026/27',
  socials: [
    { label: 'Devpost', href: 'https://devpost.com/rishikrrontala-bot' },
    { label: 'GitHub', href: 'https://github.com/rishikrrontala-bot' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Email', href: 'mailto:rishikrrontala@gmail.com' },
  ],
};

export const manifesto = [
  'Most of what people mean',
  'never makes it into what they say.',
  'The interesting problem is not the code.',
  'It is teaching a machine to sit with something',
  'inconsistent, context-dependent',
  'and human —',
  'and still be useful.',
];

export const about = {
  kicker: 'Index / About',
  title: ['Looking for', 'the meaning', 'underneath'],
  paragraphs: [
    'I am a computer science and AI student. What pulled me in was never the syntax — it was how badly machines handle the things people do without thinking. Emotion is inconsistent. Context changes the answer. Two people type the same six characters and mean opposite things.',
    'That gap is the whole job. I would rather spend a week on why a model misread someone than a week shaving milliseconds off something already correct.',
    'I lead the same way. On a team project I keep everyone anchored to the original problem rather than the checklist — the checklist is a description of the problem, not the problem itself. It is easy to ship every task and still miss the point.',
    'I am not the strongest coder in the room and I do not pretend to be. What I am good at is directing — decomposing a fuzzy problem, writing the brief precisely enough that it can be built, and knowing when the output is wrong even when it compiles.',
  ],
  facts: [
    ['Focus', 'CS & AI — affective computing, human context'],
    ['Working on', 'Hackathons, AI tooling, systems that read people'],
    ['Strength', 'Problem framing, team direction, precise briefs'],
    ['Method', 'Ask what was meant, not what was said'],
  ],
};

export const capabilities = [
  'Problem framing',
  'Affective computing',
  'C++',
  'Team leadership',
  'AI direction',
  'Prompt engineering',
  'Emotion modelling',
  'Rapid prototyping',
  'Hackathon delivery',
  'Systems thinking',
  'Technical briefs',
  'Interface design',
];

// `links` is optional. When present it is a list of { label, href } and is
// rendered on both the work-index card and the project page. Projects with
// nothing public to point at simply omit it.
export const projects = [
  {
    slug: 'emotion-engine',
    index: '01',
    title: 'Emoji → Emotion',
    // Explicit line breaks for the big display setting — each line gets its own
    // reveal mask, so they must be authored, not left to the browser to wrap.
    titleLines: ['Emoji →', 'Emotion'],
    kicker: 'C++ · Team lead',
    year: '2026',
    role: 'Team lead — architecture, delegation, problem framing',
    status: 'Shipped',
    tags: ['AI', 'Affective computing', 'C++'],
    hue: 18,
    summary:
      'A C++ chatbot that maps emojis to emotional categories — an attempt to make a program hold a category that humans themselves cannot agree on.',
    lead: 'Six characters. Two people. Opposite meanings. That is the whole problem statement.',
    body: [
      'The premise sounds small: take an emoji, return an emotion. It is not small. Emoji meaning is unstable across people, across context, and across the same person on two different days. A skull is grief or it is laughter. A thumbs-up is agreement or it is a door closing.',
      'We built a C++ chatbot that maps emoji input to emotional categories and responds in kind. The engineering was the easy half — parsing, lookup, response selection. The hard half was deciding what the categories should be at all, and accepting that any answer we picked would be wrong for somebody.',
      'I led the team: split the work, kept progress visible, and did the thing I think matters most — kept pulling us back to the original question when the task list started substituting for it. It is very possible to complete every ticket and end up with something that does not answer what you set out to ask.',
    ],
    highlights: [
      ['Role', 'Team lead — delegated tasks, oversaw progress, held the brief'],
      ['Language', 'C++'],
      ['Hard part', 'Category design, not implementation'],
      ['Took away', 'Ambiguity is the feature, not the bug to remove'],
    ],
  },
  {
    slug: 'explain-it-back',
    index: '02',
    title: 'Explain It Back',
    titleLines: ['Explain', 'It Back'],
    kicker: 'Study tool · Solo build',
    year: '2026',
    role: 'Solo — concept, engine, guard, evaluation, demo film',
    status: 'Submitted',
    tags: ['AI/ML', 'Education', 'Hackathon'],
    hue: 222,
    summary:
      'A study tool built on one rule: it never explains anything. You explain the concept; it finds the holes in what you actually understand and asks you one hard question.',
    lead: 'Reading your notes feels like understanding. The feeling is the problem.',
    body: [
      'Rozenblit and Keil called it the illusion of explanatory depth: people rate their grasp of an everyday mechanism high, then rate it far lower the moment they are made to write out how it actually works. Every study method built on recognition leaves the illusion intact — and an AI that explains a concept beautifully is the strongest recognition hit of all. You read something fluent, it makes sense, and you file that feeling as knowledge.',
      'What reliably works is generation: producing the explanation yourself, from memory, and finding out where you run out. Almost nobody does it, because it needs a listener knowledgeable enough to catch you and disciplined enough not to rescue you. Explain It Back is that listener. You name a concept, explain it cold, and it diagnoses the shape of what you said — six specific ways a mental model bends, quoted back in your own words — then asks one Socratic question aimed at the biggest structural gap. When it catches you using a term as a substitute for the idea, that term is banned from your next attempt and the ban is enforced.',
      'The single promise the product makes could not rest on a system prompt, because instructions to a language model are followed most of the time and most is not a guarantee. So the rule is enforced in three independent layers: the prompt, a mechanical scan that deletes answer-asserting sentences before the learner ever sees them, and a badge in the interface so you can watch the tool police itself. Red-teaming the first version showed seven of nine adversarial probes walking straight through — a model hands over the answer just as completely in a teacherly register as in a correction — so two more detection layers went in.',
      'The last decision was to measure it rather than assert it. The guard corpus scores 97.6% F1 across 39 leak cases at 100% precision, on top of 193 unit tests and 71 browser checks that drive the built file exactly as a judge would, including a full WCAG 2.2 AA pass computed from rendered pixels. Runs against a live model are published as a range — F1 81.3, 84.8, 88.2 across three runs on the same 16 cases — because the range is the honest number and any single one of them would be a choice about which run to show.',
    ],
    highlights: [
      ['Event', 'Prometheus August AI Challenge — solo entry'],
      ['Rule', 'It never explains. Enforced in code, not only in the prompt'],
      ['Guard', '97.6% F1 over 39 leak cases, at 100% precision'],
      ['Hard part', 'Making a promise a language model cannot break'],
    ],
    links: [
      { label: 'Live demo', href: 'https://rishikrrontala-bot.github.io/explain-it-back/' },
      { label: 'GitHub', href: 'https://github.com/rishikrrontala-bot/explain-it-back' },
    ],
  },
  {
    slug: 'habitat-pulse',
    index: '03',
    title: 'Habitat Pulse',
    titleLines: ['Habitat', 'Pulse'],
    kicker: 'Hack the Habitat · Live data',
    year: '2026',
    role: 'Concept, build — data plumbing, motion, accessibility',
    status: 'Shipped',
    tags: ['Live data', 'Climate', 'Hackathon'],
    hue: 171,
    summary:
      'Search any place on Earth for its live air quality, current weather and the threatened species recorded nearby — pulled straight from public APIs, behind a hero that expands as you scroll.',
    lead: 'Somewhere, right now, there is a number for this place. The work is making it mean something.',
    body: [
      'The Hack the Habitat brief was "build tech that protects the planet", which is the kind of prompt that invites a project to tell you what to feel. This one only tells you what is true where you are standing: the live US air quality index with a plain-language health read and a best-effort call on which pollutant is driving it, the current temperature, humidity, wind and today\'s range, and the threatened species recorded within fifty kilometres — sorted by IUCN Red List severity, each one linking back to its GBIF record.',
      'The rule underneath it was simple and load-bearing: if a number is not real, it does not appear. There is no account, no API key and no backend — every fetch is a direct client-side call to free public data from Open-Meteo and GBIF, and the actions it suggests are tied to what was actually found rather than to generic environmentalism.',
      'The hero is scroll-driven — a photograph that grows to fill the screen before the tool underneath it appears — which turns motion preference from a nicety into a correctness problem. Reduced-motion visitors get the hero mounted fully expanded with the scrub never attached, so the page scrolls normally. A deep link also mounts expanded, so a shared result is visible immediately, but keeps the scrub, because following a link says nothing about how someone feels about motion. Two separate tested predicates, not one flag.',
      'The bug worth keeping is in the species query. GBIF\'s Red List category filter silently matches zero records if the categories are comma-joined into one value; it needs repeated query parameters. It passed every test written against the documented example responses and only surfaced by calling the real endpoint — so the fix ships with a regression test pinning the shape of the URL, not just the result.',
    ],
    highlights: [
      ['Event', 'Hack the Habitat 2026'],
      ['Stack', 'Next.js 16, React 19, TypeScript, Tailwind v4'],
      ['Rule', 'If a number is not real, it does not appear'],
      ['Took away', 'A filter that returns zero is worse than one that errors'],
    ],
    links: [
      { label: 'Live demo', href: 'https://rishikrrontala-bot.github.io/habitat-pulse-hero/' },
      { label: 'GitHub', href: 'https://github.com/rishikrrontala-bot/habitat-pulse-hero' },
    ],
  },
  {
    slug: 'anxiety-guide',
    index: '04',
    title: 'Breathing Room',
    titleLines: ['Breathing', 'Room'],
    kicker: 'Writing · A guide for teens',
    year: '2026',
    role: 'Solo — writing, structure, build',
    status: 'Published',
    tags: ['Writing', 'Mental health', 'Web'],
    hue: 120,
    summary:
      'A teen\'s guide to understanding and managing anxiety — what it actually is, what helps day to day, when to ask for help, and who to ask.',
    lead: 'Anxiety is something every teenager experiences. Almost none of them are told what to do about it.',
    body: [
      'This one is not a system. It is a piece of writing, which is a different kind of problem: nothing compiles, nothing passes, and the only test is whether someone reading it at two in the morning finds something they can use.',
      'So it is organised around use rather than around the topic. What anxiety is and how it shows up in a body. Things that actually help — a controlled breathing exercise you can follow on the page, movement, journalling, putting the phone down an hour before bed, sleep, being around people who make you feel good. Then the part most guides bury: the specific signs that mean this has stopped being manageable on your own, and the specific people to tell.',
      'The resources are named and current, not gestured at — Crisis Text Line, the 988 lifeline, Teen Line, the Jed Foundation, ADAA, NIMH, and the school counsellor most students do not know they already have. There are also two sections written for the people around the teenager, because a parent who responds by saying "you have a good life, you should not worry about that" is doing measurable harm without meaning to.',
      'The tone is the whole design decision. Anything that reads as a lecture gets closed, and anything that reads as reassurance without substance gets ignored. It had to be plain, specific and unembarrassed — the register of someone the same age telling you what they found out.',
    ],
    highlights: [
      ['Format', 'Long-form guide, one static page, no framework'],
      ['Written for', 'Teenagers first; parents and educators second'],
      ['Includes', 'Guided breathing, coping tools, named crisis resources'],
      ['Hard part', 'A register that is neither a lecture nor a hug'],
    ],
    links: [
      { label: 'Live demo', href: 'https://rishikrrontala-bot.github.io/anxiety-guide/' },
      { label: 'GitHub', href: 'https://github.com/rishikrrontala-bot/anxiety-guide' },
    ],
  },
  {
    slug: 'baseline',
    index: '05',
    title: 'Baseline',
    titleLines: ['Baseline'],
    kicker: 'Hack for Humanity · Solo build',
    year: '2026',
    role: 'Solo — design, clinical logic, ML pipeline, tests, deployment',
    status: 'Shipped',
    tags: ['Health', 'Computer vision', 'Hackathon'],
    hue: 273,
    summary:
      'Concussion is diagnosed on what the injured person tells you, and they are usually motivated to say they\'re fine. Baseline screens for it by watching the eyes instead. Seven VOMS-style tasks, near point of convergence measured in real centimetres, and a recovery curve read against your own baseline. The camera never leaves your machine.',
    lead: 'An oculomotor concussion screening that runs entirely in the browser, and refuses to give you a number when the number would not mean anything.',
    body: [
      'We diagnose concussion almost entirely on self-report, from people who want to get back on the field. Eye movement is harder to lie about, and roughly half of concussion patients develop an oculomotor or vestibular problem that a validated seven-task screening can surface.',
      'Baseline runs that screening in a browser tab. MediaPipe\'s face mesh runs in WebAssembly on the user\'s own machine, and I vendored the 11.7 MB runtime and 3.7 MB model into the app\'s own origin, so not even the model download tells a third party who is using it. Near point of convergence comes out in centimetres by exploiting a biological constant: the human iris is about 11.7 mm across in every adult, which turns a webcam into a ruler.',
      'The part I care about most is what it declines to say. It won\'t report a gain from too few frames, or call 0.1 cm of webcam noise a deterioration, and when it can\'t measure something it says so rather than leaving a blank that reads as normal.',
      'Light and motion sensitivity are concussion symptoms, so the interface dims itself before the screening starts, and tells you it\'s doing it.',
    ],
    highlights: [
      ['Event', 'Hack for Humanity 2026'],
      ['Stack', 'React 19, TypeScript, Vite, Tailwind, MediaPipe (WASM), Canvas'],
      ['Scale', '116 tests. Fully static, no backend, no account, no analytics'],
      ['Hard part', 'Declining to report a number that would not mean anything'],
    ],
    links: [
      { label: 'Live demo', href: 'https://rishikrrontala-bot.github.io/baseline/' },
      { label: 'GitHub', href: 'https://github.com/rishikrrontala-bot/baseline' },
    ],
  },
  {
    slug: 'hookline',
    index: '06',
    title: 'Hookline',
    titleLines: ['Hookline'],
    kicker: 'Solo build · Runs in the browser',
    year: '2026',
    role: 'Solo — engine, CLI, interface, evaluation',
    status: 'Shipped',
    tags: ['NLP', 'Tooling', 'Web'],
    hue: 69,
    summary:
      'One long recording in, a publishable week of channel output out. It measures where a transcript holds attention and cuts where the subject actually changes — no account, no upload, no API key.',
    lead: 'Ask a model to find the good parts and it hands back the parts that summarise well. A summary is the thing that removes the reason to watch.',
    body: [
      'Clipping is the tax on long-form. Six good clips out of a forty-five minute episode — found, trimmed, hooked, titled for three platforms, captioned and scheduled — is four to six hours, every week, forever. The tempting fix is to ask a language model which moments are good, and it fails in a way that is easy to miss: it returns the moments that summarise well, which is close to the opposite of what holds someone on a vertical feed.',
      'So Hookline does not ask. It measures. Eight independent signals score every sentence — opening construction, open loops, TF-IDF salience, emotional charge, concreteness, payoff, quotability and delivery pace — each a named reading you can inspect rather than a hidden embedding. Cuts may only land on topic boundaries found by lexical cohesion: two windows slide across the transcript, and where the overlap between their vocabularies collapses, the subject has changed. That is what stops a clip ending mid-thought, and the same boundaries generate the chapter markers, so the two outputs cannot disagree about where a topic began.',
      'The decisions I am most attached to are about what not to score. "Let me be specific about what I mean" is short, first-person and direct, so a naive scorer loves it — but it is stage direction, not content, so discourse management is penalised rather than rewarded. And when a transcript arrives as plain prose with no real timings, the pace signal is withheld entirely instead of being computed from synthesised ones. A fabricated number that looks like a measurement is worse than a missing one.',
      'The optional model pass rewrites hooks and titles and nothing else — selection, timings, captions, chapters and the schedule are measurements, and measurements are never sent out to be improved. Every failure mode, from a missing key to a malformed response, falls back to the deterministic text, so there is no path where the tool returns an error state instead of a result. The engine itself has zero runtime dependencies, which is why one implementation serves both the browser and the CLI, and why the same transcript yields the same clips on any machine.',
    ],
    highlights: [
      ['Runs', 'In the browser — no account, no upload, no API key'],
      ['Method', 'Eight measured signals, boundaries by lexical cohesion'],
      ['Output', 'Clips, hooks, titles, captions, chapters, schedule, ffmpeg script'],
      ['Hard part', 'Refusing to score a signal it cannot honestly measure'],
    ],
    links: [
      { label: 'Live demo', href: 'https://rishikrrontala-bot.github.io/hookline/' },
      { label: 'GitHub', href: 'https://github.com/rishikrrontala-bot/hookline' },
    ],
  },
  {
    slug: 'loop-room',
    index: '07',
    title: 'Loop Room',
    titleLines: ['Loop', 'Room'],
    kicker: 'Code to Connect · Realtime multiplayer',
    year: '2026',
    role: 'Concept, direction, build — realtime, audio, 3D, export',
    status: 'Shipped',
    tags: ['Realtime', 'Hackathon', 'Web'],
    hue: 324,
    summary:
      'Four friends, one browser tab each. Build a two-bar loop together, draw a frame each, and leave with a music video none of you could have made alone.',
    lead: 'No feed, no library, nothing to browse. The only thing you take away is the thing the four of you made in the last ten minutes.',
    body: [
      'Code to Connect asked how digital entertainment could be made more joyful and more intentional — how you turn somebody from a consumer into a participant. Most answers to that bolt a social layer onto a feed. Loop Room has no feed and no library; there is nothing in it to consume at all. Up to four people join a room with a four-letter code, and ten minutes later they leave with a file.',
      'It runs in three stages. Everyone takes an instrument and taps a two-bar loop into a step grid locked to the C major pentatonic scale — there is no pad anyone can press that sounds wrong, which is the point: nobody needs to be a musician and nobody can ruin it. Then the loop keeps playing while the group animates to it, eight frames taken in turns, each drawn over a ghost of the last, with everyone who is not drawing watching the current artist’s ink appear stroke by stroke. Then it plays back inside a 3D room lit by lamps that pulse to the actual audio signal, and one button records exactly two loops to a video with sound.',
      'The naive build streams one machine’s audio to everyone else. It falls apart on the first network hiccup and sounds worse the further away you sit. Loop Room never sends audio anywhere. Every browser holds the same grid and the same start timestamp, runs a small NTP-style handshake to learn its offset from the server clock, and renders the identical song locally — a coarse interval decides what to play, and the audio thread’s own sample clock decides exactly when. The only thing that has to survive the network is a timestamp, so a dropped packet costs you a pad flash rather than a beat.',
      'The same clock drives the playhead, the beat-synced filmstrip and the sweeping beam in the 3D scene, which is why the light hitting a node and the sound of that node land together. Instrument ownership is enforced on the server rather than in the interface, because a rule that only exists in the UI is not a rule. Rooms live in memory and are reaped when they empty — there is no database, by choice. Nothing here is worth persisting beyond the session, and the video is the artefact you keep.',
    ],
    highlights: [
      ['Event', 'Code to Connect: Women in Tech Hackathon 2026 — Connect Online'],
      ['Stack', 'React, TypeScript, WebSocket, Web Audio, three.js, MediaRecorder'],
      ['Sync', 'NTP-style clock handshake — audio is scheduled, never streamed'],
      ['Hosting', 'One Node process serves app and socket; the free tier sleeps when idle'],
    ],
    links: [
      { label: 'Live demo', href: 'https://loop-room.onrender.com' },
      { label: 'GitHub', href: 'https://github.com/rishikrrontala-bot/loop-room' },
    ],
  },
  {
    slug: 'leaseleak',
    index: '08',
    title: 'LeaseLeak',
    titleLines: ['Lease', 'Leak'],
    kicker: 'VentureFix 2026 · Solo build',
    year: '2026',
    role: 'Solo — data pipeline, deterministic engine, AI verification layer, deploy',
    status: 'Shipped',
    tags: ['AI/ML', 'Hackathon', 'Tooling'],
    hue: 95,
    summary:
      'Drop a rent roll and it matches every unit to HUD and Zillow benchmarks, times renewals to the seasonal peak, and writes the renewal letters — with an AI layer that gets checked on every number it cites.',
    lead: 'Every dollar figure on the page is computed by a deterministic engine. The model only writes the memo, and it is checked on every number it uses.',
    body: [
      'Built solo for VentureFix 2026\'s Venture Build track. You drop a CSV or XLSX rent roll and, five seconds later, see how far under market each unit is against HUD\'s Small Area Fair Market Rent for its ZIP and bedroom count, which leases end in the wrong month, and a renewal letter already written for each one. FMR is the 40th percentile of local gross rents, so the gap it reports is a conservative floor, not an inflated pitch number.',
      'The same base numbers get reused rather than re-derived: Zillow\'s ZORI index turns into a seasonal curve so renewal terms can be timed to end at the local peak, the gap gets priced as building equity through an adjustable cap rate, and HUD\'s voucher payment standards are checked against the same rents to see where a housing voucher would close the gap without raising anyone\'s rent. A rent-to-income check against Census ACS data flags any proposed increase that would push a household over 30% of income before a letter goes out.',
      'The model is only allowed to do what a spreadsheet cannot: it writes the headline, the prioritised actions and a caution in plain language, sending it only the unit figures with tenant names stripped. Nothing it writes is trusted on its own — a client-side check pulls every dollar, percentage and month figure out of the model\'s reply and matches each one against the engine\'s own output, so the interface can say exactly how many of the cited figures trace back to a real computation and flag the one that does not.',
      'The Gemini calls run through a Vercel function with an origin allow-list, a per-IP rate limit and a 200 KB body cap, and the same functions are called cross-origin from the GitHub Pages mirror. Everything else — the matching, the gap math, the seasonal timing, the letters — runs in the browser with no account and no upload.',
    ],
    highlights: [
      ['Event', 'VentureFix 2026 — Venture Build track, solo entry'],
      ['Data', 'HUD Small Area FMR (38,601 ZIPs), Zillow ZORI, Census ACS income'],
      ['Guard', "Every AI-cited figure is matched back against the engine's own numbers"],
      ['Hard part', 'Keeping a language model from citing a number it did not compute'],
    ],
    links: [
      { label: 'Live demo', href: 'https://leaseleak.vercel.app' },
      { label: 'GitHub', href: 'https://github.com/rishikrrontala-bot/leaseleak' },
    ],
  },
  {
    slug: 'earshot',
    index: '09',
    title: 'Earshot',
    titleLines: ['Earshot'],
    kicker: 'TechCommons Hacks V2 · Solo build',
    year: '2026',
    role: 'Solo — protocol design, DSP, interface, verification',
    status: 'Shipped',
    tags: ['Audio', 'Web', 'Hackathon'],
    hue: 351,
    summary:
      'A 16-tone acoustic modem built from scratch in the browser — one device plays a message as sound, every other device in the room decodes it back to text, with no network, pairing or install.',
    lead: 'When the network goes down, the phones in the room still work. They just cannot talk to each other. Sound can carry that.',
    body: [
      'Bluetooth needs pairing, one device at a time. AirDrop is Apple-only. A QR code is one reader at a time and caps out around two kilobytes. None of them get the same sentence onto thirty phones at once when the network is gone — but sound is omnidirectional and one-to-many for free, and every phone made in the last twenty years can already produce and hear it.',
      'Earshot is a 16-tone, continuous-phase FSK modem written from scratch in TypeScript, with no audio or DSP libraries. It modulates across 1500–3625 Hz at 125 Hz spacing, 32 ms symbols, for a data rate of 125 bits per second. Each frame is framed with sync symbols, payload nibbles, a CRC-8 and an end tone, and detection runs a Hann-windowed Goertzel filter over eighteen tones with a confidence gate. Timing is recovered by refining the onset against the sync plateau, then searching sub-symbol offsets and letting the CRC arbitrate which one is right.',
      'Reliability comes entirely from retransmission rather than acknowledgement: the transmitter repeats the whole frame blindly, and the first copy that passes CRC wins. Measured against synthetic channels, it decodes correctly at −13 dB SNR, produces zero false messages across 120 seconds of pure white noise, and survives simulated room reverb and arbitrary timing offsets. A 28-character alert costs 2.0 seconds of airtime, or 6.0 seconds sent three times for safety.',
      'The README is upfront about what this is not: not private, since anything within earshot receives it — that is the mechanism, not a bug; not fast, at 15.6 bytes a second it is for a sentence, not a file; and not guaranteed, since there is no acknowledgement and the transmitter just hopes the retransmissions land.',
    ],
    highlights: [
      ['Event', 'TechCommons Hacks V2 — solo entry'],
      ['Protocol', '16-tone continuous-phase FSK, 1500–3625 Hz, 125 bps'],
      ['Measured', '−13 dB SNR decode; 0 false messages in 120 s of white noise'],
      ['Hard part', 'No pairing and no acknowledgement — just retransmission and a CRC'],
    ],
    links: [
      { label: 'Live demo', href: 'https://rishikrrontala-bot.github.io/earshot/' },
      { label: 'GitHub', href: 'https://github.com/rishikrrontala-bot/earshot' },
    ],
  },
];

// The drag-to-explore plane mixes projects with fragments — the way a studio
// index page mixes work with the thinking around it.
export const worldFragments = [
  { kind: 'statement', text: 'Ambiguity is the signal.' },
  { kind: 'stat', label: 'Focus', value: 'CS / AI' },
  { kind: 'statement', text: 'Lead through the problem, not the org chart.' },
  { kind: 'stat', label: 'Language', value: 'C++' },
  { kind: 'statement', text: 'The checklist is a description of the problem. It is not the problem.' },
  { kind: 'stat', label: 'Base', value: 'US · EST' },
  { kind: 'statement', text: 'Two people, six characters, opposite meanings.' },
  { kind: 'stat', label: 'Status', value: 'Open' },
  { kind: 'statement', text: 'A rule that only exists in the interface is not a rule.' },
  { kind: 'stat', label: 'Also', value: 'TypeScript' },
  { kind: 'statement', text: 'A summary is the thing that removes the reason to watch.' },
  { kind: 'stat', label: 'Method', value: 'Measure, not assert' },
  { kind: 'statement', text: 'A fabricated number that looks like a measurement is worse than a missing one.' },
  { kind: 'statement', text: 'The model can write the memo. It does not get to write the numbers.' },
  { kind: 'statement', text: 'Sound is omnidirectional and one-to-many for free.' },
  { kind: 'statement', text: 'Knowing when to decline to answer is a feature you have to build.' },
  { kind: 'statement', text: 'I would rather be right slowly.' },
];

export const nav = [
  { label: 'Index', to: '/', hash: '#top' },
  { label: 'Work', to: '/', hash: '#work' },
  { label: 'World', to: '/', hash: '#world' },
  { label: 'About', to: '/', hash: '#about' },
  { label: 'Contact', to: '/', hash: '#contact' },
];
