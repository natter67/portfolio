// Everything about Nathan that isn't a project or a photo.
// Edit freely — components read from here and never hard-code copy.

export const profile = {
  name: "Nathan Chan",
  fullName: "Nathan Kingsley Chan",
  email: "nathan49@illinois.edu",
  linkedin: "https://linkedin.com/in/nathan-chan01",
  resume: "/Nathan-Chan-Resume.pdf",
  siteUrl: "https://nathanchan.vercel.app",

  oneLiner:
    "Materials Science & Engineering @ Illinois. I make metals tell me why they fail — and what to build next.",
  // Alternatives for the hero line — swap one into `oneLiner` if you prefer it.
  oneLinerAlternates: [
    "Materials engineer in training. I polish, etch, and break metal to find out what it can take.",
    "I study metals from the grain up — how they're made, why they fail, and what to use instead.",
    "Materials Science & Engineering @ Illinois. Lab bench to boring machine, I work where materials meet hardware.",
  ],
  meta: ["UIUC '28", "Grainger Engineering", "James Scholar"],

  // "Now" — one line on what you're working on this month. Update monthly.
  now: {
    month: "Oct 2026",
    text: "Sizing pumps and screens for Boring Illini's muck-removal system, and writing up MSE 307 labs.",
  },

  education: {
    school: "University of Illinois Urbana-Champaign",
    college: "Grainger College of Engineering",
    degree: "B.S. Materials Science & Engineering",
    expected: "May 2028",
    minor: "Hoeft Technology & Management Minor",
  },

  interests:
    "Design, processing, and characterization of high-performance metals and alloys for advanced manufacturing, energy, and industrial applications — structure–processing–property relationships, failure analysis, and materials selection.",

  // Logos live in public/logos/ (Wikimedia Commons; the Eagle badge is used to identify the rank earned).
  honors: [
    { name: "Eagle Scout", logo: "/logos/eagle-scout.png", org: "Scouting America" },
    { name: "USA Water Polo Academic All-American", logo: "/logos/usa-water-polo.svg", org: "USA Water Polo" },
    { name: "Barth Scholarship", logo: "/logos/rotary.svg", org: "Rotary Club of San Marino" },
    { name: "James Scholar", logo: "/logos/illinois.svg", org: "University of Illinois Urbana-Champaign" },
  ],

  toolkit: [
    {
      group: "Characterization",
      items: [
        "Metallography (section · mount · grind · polish · etch)",
        "Optical & stereo microscopy",
        "SEM",
        "EDS",
        "FTIR",
        "OES",
        "Hardness testing",
        "Magnetic particle inspection",
        "Cyclic voltammetry",
      ],
    },
    {
      group: "Fabrication",
      items: ["3D printing (DLP, HIAM)", "Manual milling", "Lathe / turning", "Soldering"],
    },
    {
      group: "Software",
      items: [
        "Python",
        "MATLAB",
        "Java",
        "JavaScript / TypeScript",
        "React / Next.js",
        "Firebase",
        "Fusion 360",
        "nTopology",
        "Excel",
        "Data modeling",
      ],
    },
  ],

  // "The story so far" — the flight log on the home page. In travel order;
  // lat/lon place each pit stop on the map. `proof` links to the work done there.
  route: [
    {
      place: "Pasadena, CA",
      lat: 34.1478,
      lon: -118.1445,
      when: "Home · through 2025",
      title: "Where it started",
      text: "San Marino High School, a lot of water polo, and Scouting all the way to Eagle. In high school, a year in a Caltech materials lab turning 3D-printed hydrogel into metal battery electrodes.",
      proof: [{ label: "Caltech HIAM research", href: "/work/caltech-hiam-electrodes/" }],
    },
    {
      place: "Champaign, IL",
      lat: 40.1164,
      lon: -88.2434,
      when: "Aug 2025",
      title: "Illinois",
      text: "Materials Science & Engineering at Grainger. Within the first semester: Boring Illini's cutterhead subteam, and one of two freshmen on the Engineering Open House committee.",
      proof: [
        { label: "Cutterhead steel study", href: "/work/boring-illini-cutterhead-steel/" },
        { label: "EOH site & app", href: "/work/eoh-technology/" },
      ],
    },
    {
      place: "Bastrop, TX",
      lat: 30.1105,
      lon: -97.3153,
      when: "Apr 2026",
      title: "Competition week",
      text: "The Boring Company's Not-a-Boring Competition. A season of Boring Illini design work met real ground, hard hats on.",
      proof: [{ label: "Soil-conditioning system", href: "/work/boring-illini-acp-system/" }],
    },
    {
      place: "Maumee, OH",
      lat: 41.5628,
      lon: -83.6538,
      when: "May – Aug 2026",
      title: "Dana co-op",
      text: "A summer in Dana's materials lab: failure analysis on 25+ production components for automotive OEMs, and more hours at the polishing wheel than anywhere else.",
      proof: [{ label: "Dana co-op", href: "/work/dana-materials-coop/" }],
    },
    {
      place: "Champaign, IL",
      lat: 40.1164,
      lon: -88.2434,
      when: "Fall 2026 · now",
      title: "Back on campus",
      text: "Leading Boring Illini's muck-removal subsystem for the 2027 competition, writing MSE 307 lab reports, and building the next EOH.",
      proof: [
        { label: "Muck-removal system", href: "/work/boring-illini-muck-removal/" },
        { label: "MSE 307", href: "/work/mse-307-solidification/" },
      ],
    },
  ],
  next: "The next lab, line, or launch pad. Let's talk.",

  // The boarding pass under the flight map. Every number here must be real.
  boarding: {
    destinations: ["Aerospace", "Defense", "Semiconductors", "Energy", "Advanced mfg", "EVs & drivetrain", "Your team?"],
    seeking: "Internships & co-ops",
    proof: [
      { value: "25+", label: "production parts through failure analysis at Dana" },
      { value: "52%", label: "fewer cutterhead revolutions, shown with repeated trials" },
      { value: "30k+", label: "annual visitors on the EOH site I help build" },
      { value: "8", label: "engineers on the muck-removal subsystem I lead" },
    ],
    carryOn: ["Metallography", "Failure analysis", "SEM / EDS", "Materials selection", "Python", "React / Next.js"],
  },
} as const;

export const updated = "October 2026"; // Shown in the footer — bump when you edit content.
