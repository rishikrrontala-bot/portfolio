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
  email: 'ramadevi.venganti@gmail.com',
  availability: 'Open to internships, research and hackathon teams — 2026/27',
  socials: [
    { label: 'Devpost', href: 'https://devpost.com/rishikrrontala-bot' },
    { label: 'GitHub', href: 'https://github.com/' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/' },
    { label: 'Email', href: 'mailto:ramadevi.venganti@gmail.com' },
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
    slug: 'prometheus-challenge',
    index: '02',
    title: 'Prometheus AI Challenge',
    titleLines: ['Prometheus', 'AI Challenge'],
    kicker: 'Devpost · First hackathon',
    year: '2026',
    role: 'Solo — concept, build, demo',
    status: 'Submitted',
    tags: ['AI/ML', 'Education', 'Hackathon'],
    hue: 200,
    summary:
      'An AI/ML educational tool built for the Prometheus August AI Challenge — first hackathon, entered to find out where the floor actually is.',
    lead: 'You do not learn where your limit is by reading about the limit.',
    body: [
      'Prometheus was my first hackathon. The brief: build an AI/ML educational tool, submit a two-minute demo and the source. The deadline was 2:45am. That detail matters more than it should — a deadline that specific tells you the format is about finishing, not about polishing.',
      'I picked it deliberately. Beginner-friendly, modest prize, less competition — the point of a first entry is to convert an abstraction ("I could probably do a hackathon") into evidence one way or the other.',
      'What I took from it was less about the model and more about scope: the demo video is the product for two minutes, and anything that cannot be shown in that window may as well not exist. That reframes what you build from the first hour onward.',
    ],
    highlights: [
      ['Event', 'Prometheus August AI Challenge, Devpost'],
      ['Brief', 'AI/ML educational tool + 2-minute demo + source'],
      ['Format', 'Solo, first hackathon'],
      ['Took away', 'Build for the demo window, not the README'],
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
  { kind: 'statement', text: 'I would rather be right slowly.' },
];

export const nav = [
  { label: 'Index', to: '/', hash: '#top' },
  { label: 'Work', to: '/', hash: '#work' },
  { label: 'World', to: '/', hash: '#world' },
  { label: 'About', to: '/', hash: '#about' },
  { label: 'Contact', to: '/', hash: '#contact' },
];
