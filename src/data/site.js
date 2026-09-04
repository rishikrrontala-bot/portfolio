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
    'I build systems that try to read what people mean, not just what they typed.',
  location: 'United States',
  timezone: 'America/New_York',
  email: 'rishikrrontala@gmail.com',
  availability: 'Open to internships, research and hackathon teams for 2026/27',
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
  'The hard part was never the code.',
  'It\'s getting a machine to sit with something',
  'inconsistent, context-dependent',
  'and human,',
  'and still be useful.',
];

export const about = {
  kicker: 'Index / About',
  title: ['Looking for', 'the meaning', 'underneath'],
  paragraphs: [
    'I\'m a computer science and AI student. What pulled me in wasn\'t the syntax, it was how badly machines handle the things people do without thinking. Emotion is inconsistent, context changes the answer, and two people can type the same six characters and mean opposite things.',
    'That gap is the part I want to work on. I\'d rather spend a week on why a model misread someone than a week shaving milliseconds off something that already works.',
    'I lead the same way. On a team project I keep pulling people back to the original question instead of the task list, because a task list only ever describes the problem. You can finish every ticket and still miss what you were trying to answer.',
    'I\'m not the strongest coder in the room and I don\'t pretend to be. What I\'m good at is direction: breaking a vague problem into something buildable, writing the brief precisely enough that someone can act on it, and noticing when the output is wrong even though it compiles.',
  ],
  facts: [
    ['Focus', 'CS and AI. Affective computing, human context'],
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
      'A C++ chatbot that maps emojis to emotional categories, which means getting a program to hold a category people themselves can\'t agree on.',
    lead: 'Two people send the same six characters and mean opposite things.',
    body: [
      'The premise sounds small: take an emoji, return an emotion. It isn\'t. Emoji meaning shifts between people, between contexts, and in the same person on two different days. A skull is grief or it\'s laughter. A thumbs-up is agreement or it\'s a door closing.',
      'We built a C++ chatbot that takes emoji input, maps it to an emotional category and responds in kind. The engineering was the easy half: parsing, lookup, response selection. The hard half was deciding what the categories should be at all, and accepting that whatever we picked would be wrong for somebody.',
      'I led the team, which mostly meant splitting the work, keeping progress visible, and pulling us back to the original question whenever the task list started standing in for it. It\'s very possible to finish every ticket and end up with something that doesn\'t answer what you set out to ask.',
    ],
    highlights: [
      ['Role', 'Team lead — delegated tasks, oversaw progress, held the brief'],
      ['Language', 'C++'],
      ['Hard part', 'Category design, not implementation'],
      ['Took away', 'The ambiguity was the subject, not a defect to remove'],
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
    hue: 200,
    summary:
      'A study tool built on one rule: it never explains anything. You explain the concept; it finds the holes in what you actually understand and asks you one hard question.',
    lead: 'Reading your notes feels like understanding. The feeling is the problem.',
    body: [
      'Rozenblit and Keil called it the illusion of explanatory depth: people rate their grasp of an everyday mechanism high, then rate it far lower the moment they have to write out how it actually works. Every study method built on recognition leaves the illusion intact — and an AI that explains a concept beautifully is the strongest recognition hit of all. You read something fluent, it makes sense, and you file that feeling away as knowledge.',
      'What reliably works is generation: producing the explanation yourself, from memory, and finding out where you run out. Almost nobody does it, because it needs a listener knowledgeable enough to catch you and disciplined enough not to rescue you. Explain It Back is that listener. You name a concept, explain it cold, and it diagnoses the shape of what you said: six specific ways a mental model bends, quoted back in your own words. Then it asks one Socratic question aimed at the biggest gap. If it catches you using a term as a substitute for the idea, that term is banned from your next attempt, and the ban is enforced.',
      'The one promise this makes couldn\'t rest on a system prompt. A language model follows instructions most of the time, and most of the time isn\'t a guarantee. So the rule runs in three independent layers: the prompt, a mechanical scan that deletes answer-asserting sentences before the learner ever sees them, and a badge in the interface so you can watch the tool police itself. Red-teaming the first version sent nine adversarial probes at it and seven walked straight through, because a model hands over the answer just as completely in a teacherly register as in a correction. Two more detection layers went in.',
      'The last decision was to measure it instead of asserting it. The guard corpus scores 97.6% F1 across 39 leak cases at 100% precision, on top of 193 unit tests and 71 browser checks that drive the built file exactly as a judge would, including a full WCAG 2.2 AA pass computed from rendered pixels. Runs against a live model are published as a range: F1 81.3, 84.8 and 88.2 across three runs on the same 16 cases. The range is the honest number, and picking any single one of them would be a choice about which run to show.',
    ],
    highlights: [
      ['Event', 'Prometheus August AI Challenge — solo entry'],
      ['Rule', 'It never explains, and that\'s enforced in code, not just the prompt'],
      ['Guard', '97.6% F1 over 39 leak cases, at 100% precision'],
      ['Hard part', 'Making a promise a language model can\'t break'],
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
    hue: 152,
    summary:
      'Search any place on Earth for its live air quality, current weather and the threatened species recorded nearby, pulled straight from public APIs, behind a hero that expands as you scroll.',
    lead: 'There\'s a live number for almost anywhere on Earth. Making it mean something is the harder part.',
    body: [
      'The Hack the Habitat brief was "build tech that protects the planet", which is the kind of prompt that invites a project to tell you what to feel. This one just tells you what\'s true where you\'re standing: the live US air quality index with a plain-language health read and a best-effort call on which pollutant is driving it, the current temperature, humidity, wind and today\'s range, and the threatened species recorded within fifty kilometres, sorted by IUCN Red List severity and each linking back to its GBIF record.',
      'One rule held the whole thing up: if a number isn\'t real, it doesn\'t appear. There\'s no account, no API key and no backend. Every fetch is a direct client-side call to free public data from Open-Meteo and GBIF, and the actions it suggests are tied to what was actually found rather than to generic environmentalism.',
      'The hero is scroll-driven, a photograph that grows to fill the screen before the tool underneath it appears, which turns motion preference from a nicety into a correctness problem. Reduced-motion visitors get the hero mounted fully expanded with the scrub never attached, so the page scrolls normally. A deep link also mounts expanded, so a shared result is visible immediately, but keeps the scrub, because following a link says nothing about how someone feels about motion. They\'re two separately tested predicates, since merging them into one flag brings a real bug back.',
      'The bug worth keeping is in the species query. GBIF\'s Red List category filter silently matches zero records if the categories are comma-joined into one value; it needs repeated query parameters. It passed every test written against the documented example responses and only showed up when I called the real endpoint, so the fix ships with a regression test that pins the shape of the URL as well as the result.',
    ],
    highlights: [
      ['Event', 'Hack the Habitat 2026'],
      ['Stack', 'Next.js 16, React 19, TypeScript, Tailwind v4'],
      ['Rule', 'If a number isn\'t real, it doesn\'t appear'],
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
    hue: 96,
    summary:
      'A teen\'s guide to understanding and managing anxiety: what it actually is, what helps day to day, when to ask for help, and who to ask.',
    lead: 'Almost every teenager deals with anxiety. Very few get told what to actually do about it.',
    body: [
      'This one isn\'t a system, it\'s a piece of writing, which is a different kind of problem. Nothing compiles, nothing passes, and the only real test is whether someone reading it at two in the morning finds something they can use.',
      'So it\'s organised around use rather than around the topic. What anxiety is and how it shows up in a body. Things that actually help: a controlled breathing exercise you can follow on the page, movement, journalling, putting the phone down an hour before bed, sleep, being around people who make you feel good. Then the part most guides bury, which is the specific signs that this has stopped being manageable on your own, and the specific people to tell.',
      'The resources are named and current rather than gestured at: Crisis Text Line, the 988 lifeline, Teen Line, the Jed Foundation, ADAA, NIMH, and the school counsellor most students don\'t know they already have. Two sections are written for the people around the teenager, because a parent who answers with "you have a good life, you shouldn\'t worry about that" is doing harm without meaning to.',
      'Tone was the main design decision. Anything that reads as a lecture gets closed, and anything that reads as reassurance without substance gets ignored. It had to be plain, specific and unembarrassed, closer to someone the same age telling you what they worked out.',
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
];

// The drag-to-explore plane mixes projects with fragments — the way a studio
// index page mixes work with the thinking around it.
export const worldFragments = [
  { kind: 'statement', text: 'Ambiguity is the signal.' },
  { kind: 'stat', label: 'Focus', value: 'CS / AI' },
  { kind: 'statement', text: 'Lead through the problem, not the org chart.' },
  { kind: 'stat', label: 'Language', value: 'C++' },
  { kind: 'statement', text: 'A checklist describes the problem. It isn\'t the problem.' },
  { kind: 'stat', label: 'Base', value: 'US · EST' },
  { kind: 'statement', text: 'Two people, six characters, opposite meanings.' },
  { kind: 'stat', label: 'Status', value: 'Open' },
  { kind: 'statement', text: 'I\'d rather be right slowly.' },
];

export const nav = [
  { label: 'Index', to: '/', hash: '#top' },
  { label: 'Work', to: '/', hash: '#work' },
  { label: 'World', to: '/', hash: '#world' },
  { label: 'About', to: '/', hash: '#about' },
  { label: 'Contact', to: '/', hash: '#contact' },
];
