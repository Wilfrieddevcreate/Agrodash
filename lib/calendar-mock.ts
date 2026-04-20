/**
 * Calendar mock data — deterministic seeded generation.
 *
 * No Date.now() / Math.random() is used at module scope, so the same list is
 * produced on the server and on the client (no SSR/CSR hydration drift).
 */

export type CalendarEventKind =
  | "harvest"
  | "planting"
  | "delivery"
  | "meeting"
  | "inspection"
  | "payment"
  | "training";

export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  /** ISO datetime string */
  start: string;
  /** ISO datetime string */
  end: string;
  allDay?: boolean;
  kind: CalendarEventKind;
  location?: string;
  attendees?: Array<{ name: string; email?: string }>;
  /** Optional override — if absent, UI derives from `kind`. */
  color?: string;
}

/** Stable anchor — today for the seeded dataset. */
const NOW = new Date("2026-04-20T10:00:00.000Z").getTime();

/* ──────────────────────────────────────────────────────────
 * Deterministic pseudo-random helpers
 * ────────────────────────────────────────────────────────── */

function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function pick<T>(rng: () => number, arr: readonly T[]): T {
  return arr[Math.floor(rng() * arr.length)]!;
}

function pad(n: number): string {
  return n.toString().padStart(2, "0");
}

/** Build an ISO-like local datetime string (no TZ suffix → browser interprets as local). */
function localIso(date: Date, hour: number, minute: number): string {
  const y = date.getFullYear();
  const m = pad(date.getMonth() + 1);
  const d = pad(date.getDate());
  return `${y}-${m}-${d}T${pad(hour)}:${pad(minute)}:00`;
}

/* ──────────────────────────────────────────────────────────
 * Content pools — realistic agribusiness titles
 * ────────────────────────────────────────────────────────── */

const TITLES: Record<CalendarEventKind, readonly string[]> = {
  harvest: [
    "Harvest rice field B",
    "Harvest cashew lot 48",
    "Harvest mango grove — north",
    "Harvest sorghum block C",
    "Harvest cassava — plot 12",
    "Harvest maize — east section",
  ],
  planting: [
    "Planting soy — plot 7",
    "Planting okra nursery",
    "Planting onion starters",
    "Planting groundnut — field A",
    "Planting cover crop — block D",
  ],
  delivery: [
    "Delivery to Nairobi Depot",
    "Delivery to Port of Mombasa",
    "Delivery — cooperative Amara",
    "Delivery to Accra warehouse",
    "Delivery to Lagos market",
    "Delivery to Abidjan hub",
  ],
  meeting: [
    "Weekly ops sync",
    "Cooperative board meeting",
    "Quarterly review — region west",
    "Supplier onboarding — Agrinova",
    "Strategy review with investors",
  ],
  inspection: [
    "QC inspection — cashew lot 48",
    "Field inspection — rice block B",
    "Equipment inspection — tractors",
    "Cold storage audit",
    "Soil sampling — block D",
  ],
  payment: [
    "Monthly payment — bank transfer batch",
    "Payroll — field operations",
    "Supplier payment — Agrinova",
    "Cooperative payout — Amara",
    "Tax filing — Q2 provisional",
  ],
  training: [
    "Fertilizer training — cooperative Amara",
    "Drip irrigation workshop",
    "Post-harvest handling training",
    "Safety induction — new hires",
    "Digital tools training — field leads",
  ],
};

const LOCATIONS: readonly string[] = [
  "Farm HQ — Office A",
  "Field B — North gate",
  "Nairobi Depot",
  "Port of Mombasa",
  "Abidjan logistics hub",
  "Cooperative Amara — Hall",
  "Accra warehouse",
  "Training room — Block D",
  "Cold storage — Unit 3",
];

const ATTENDEES: ReadonlyArray<{ name: string; email: string }> = [
  { name: "Alex Diallo", email: "alex@agrodash.io" },
  { name: "Amina Kone", email: "amina@agrodash.io" },
  { name: "Moussa Traoré", email: "moussa@agrodash.io" },
  { name: "Fatou Sall", email: "fatou@agrodash.io" },
  { name: "Kwame Mensah", email: "kwame@agrodash.io" },
  { name: "Noura El Amrani", email: "noura@agrodash.io" },
  { name: "Ibrahim Okafor", email: "ibrahim@agrodash.io" },
  { name: "Esther Adeyemi", email: "esther@agrodash.io" },
];

const DESCRIPTIONS: Record<CalendarEventKind, string> = {
  harvest:
    "Coordinate harvest crew, confirm equipment and logistics, record final yield.",
  planting:
    "Prepare seed batches and plot layout; confirm irrigation and weather window.",
  delivery:
    "Confirm outbound manifest, driver assignment and unload window at destination.",
  meeting: "Review status, blockers and next actions. Agenda shared ahead.",
  inspection:
    "Walkthrough and sign-off against the QC checklist; attach photos to the report.",
  payment:
    "Queue bank transfers, confirm reconciliation and send payment confirmations.",
  training: "Hands-on session for field staff. Bring badges and notebooks.",
};

const KINDS: readonly CalendarEventKind[] = [
  "harvest",
  "planting",
  "delivery",
  "meeting",
  "inspection",
  "payment",
  "training",
] as const;

/* ──────────────────────────────────────────────────────────
 * Seeded generator — produces ~45 events across ~2 months
 * ────────────────────────────────────────────────────────── */

function generateEvents(): CalendarEvent[] {
  const rng = mulberry32(20260420);
  const anchor = new Date(NOW);
  const events: CalendarEvent[] = [];

  // Span from 35 days before anchor to 35 days after (~2 months)
  const SPAN_BEFORE = 35;
  const SPAN_AFTER = 35;
  const TOTAL = 46;

  for (let i = 0; i < TOTAL; i++) {
    const kind = pick(rng, KINDS);
    const titles = TITLES[kind];
    const title = titles[i % titles.length]!;

    // day offset from anchor, roughly uniform across the window
    const dayOffset =
      Math.floor(rng() * (SPAN_BEFORE + SPAN_AFTER)) - SPAN_BEFORE;

    const day = new Date(anchor);
    day.setDate(day.getDate() + dayOffset);

    // ~1 in 6 are all-day
    const allDay = rng() < 0.16;

    let startHour = 8 + Math.floor(rng() * 9); // 8..16
    let durationH = 1 + Math.floor(rng() * 3); // 1..3

    // Payments & trainings bias to longer mid-day slots
    if (kind === "payment" || kind === "training") {
      startHour = 9 + Math.floor(rng() * 4); // 9..12
      durationH = 2 + Math.floor(rng() * 2);
    }
    // Deliveries often mid-morning
    if (kind === "delivery") {
      startHour = 7 + Math.floor(rng() * 4);
      durationH = 2 + Math.floor(rng() * 3);
    }

    let start: string;
    let end: string;
    if (allDay) {
      start = localIso(day, 0, 0);
      const endDay = new Date(day);
      // Most all-day are single day; 1 in 4 spans a second day
      if (rng() < 0.25) endDay.setDate(endDay.getDate() + 1);
      end = localIso(endDay, 23, 59);
    } else {
      const minuteStart = rng() < 0.5 ? 0 : 30;
      start = localIso(day, startHour, minuteStart);
      const endDate = new Date(day);
      const endHour = Math.min(23, startHour + durationH);
      end = localIso(endDate, endHour, minuteStart);
    }

    // Location — most events have one
    const location = rng() < 0.82 ? pick(rng, LOCATIONS) : undefined;

    // Attendees — 0..4, biased towards having some
    const attendeeCount =
      rng() < 0.22 ? 0 : 1 + Math.floor(rng() * 4); // 1..4
    const attendees =
      attendeeCount === 0
        ? undefined
        : shuffleTake(rng, ATTENDEES, attendeeCount);

    events.push({
      id: `evt-${(i + 1).toString().padStart(3, "0")}`,
      title,
      description: DESCRIPTIONS[kind],
      start,
      end,
      allDay: allDay || undefined,
      kind,
      location,
      attendees,
    });
  }

  // Sort by start (stable, string ISO compare works for same-format strings)
  events.sort((a, b) => (a.start < b.start ? -1 : a.start > b.start ? 1 : 0));
  return events;
}

function shuffleTake<T>(
  rng: () => number,
  arr: readonly T[],
  n: number
): T[] {
  const copy = arr.slice();
  // Fisher-Yates
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    const tmp = copy[i]!;
    copy[i] = copy[j]!;
    copy[j] = tmp;
  }
  return copy.slice(0, n);
}

export const calendarEvents: CalendarEvent[] = generateEvents();

/* ──────────────────────────────────────────────────────────
 * Display metadata — colors & labels per kind
 * ────────────────────────────────────────────────────────── */

export const eventKindColor: Record<CalendarEventKind, string> = {
  harvest: "var(--color-chart-1)",
  planting: "var(--color-chart-2)",
  delivery: "var(--color-chart-3)",
  meeting: "var(--color-chart-5)",
  inspection: "var(--color-chart-4)",
  payment: "var(--color-chart-6)",
  training: "var(--color-warning)",
};

export const eventKindLabel: Record<CalendarEventKind, string> = {
  harvest: "Harvest",
  planting: "Planting",
  delivery: "Delivery",
  meeting: "Meeting",
  inspection: "Inspection",
  payment: "Payment",
  training: "Training",
};

export const calendarKindOptions: Array<{
  label: string;
  value: CalendarEventKind;
}> = KINDS.map((k) => ({ label: eventKindLabel[k], value: k }));
