// Every project card + case study on the site.
// To add one: copy an entry, give it a unique `slug`, set `published: true`.
// Order here = order on the home page.

export const categories = [
  "Materials",
  "Engineering",
  "Software",
  "Leadership",
  "Life",
] as const;
export type Category = (typeof categories)[number];

export type CaseStudy = {
  problem: string[];
  approach: string[];
  result: string[];
  next: string[];
};

export type Project = {
  slug: string;
  specimen: string; // e.g. "03" → rendered as "SPECIMEN 03"
  symbol: string; // two-letter element symbol on the periodic table
  label: string; // short specimen label, e.g. "BORING ILLINI"
  title: string;
  org: string;
  location?: string;
  role: string;
  dates: string;
  team: string;
  tools: string[];
  outcome: string; // one sentence for the card + spec table
  categories: Category[];
  tags: string[]; // free-form chips shown on the card
  cover?: string; // photo id from content/photos.ts
  gallery?: string[]; // extra photo ids shown in the case study
  links?: { label: string; href: string }[]; // shown in the datasheet (code, reports…)
  figures?: string[]; // full-width, uncropped figures (micrographs, plots) shown under Approach
  cad?: { embed: string; share: string; poster: string }; // Autodesk Fusion public share
  published: boolean;
  confidential?: boolean; // shows an NDA note on the case study
  note?: string; // small aside shown on the card
  caseStudy?: CaseStudy; // omit for card-only entries
};

export const projects: Project[] = [
  {
    slug: "boring-illini-cutterhead-steel",
    specimen: "01",
    symbol: "Bl",
    label: "BORING ILLINI",
    title: "Choosing the steel for a cutterhead blade",
    org: "Boring Illini",
    role: "Cutterhead subteam member",
    dates: "Sept – Dec 2025",
    team: "",
    tools: ["Materials selection", "Torque & thrust testing", "Fusion 360", "Excel"],
    outcome:
      "Picked 4140 from seven candidate steels, and showed with repeated trials that an offset-control layout cut required revolutions by 52%.",
    categories: ["Materials", "Engineering"],
    tags: ["Materials selection", "Tool steels", "Testing"],
    cover: "boring-illini-team",
    gallery: ["boring-illini-banner", "boring-illini-night-crew"],
    links: [{ label: "Trade study & test statistics (Python)", href: "https://github.com/natter67/blade_trade_study" }],
    published: true,
    caseStudy: {
      problem: [
        "Boring Illini builds a vertical boring machine for The Boring Company's Not-a-Boring Competition. The cutterhead blades have to chew through conditioned clay without dulling, chipping, or costing more than the team can machine.",
      ],
      approach: [
        "I compared four tool steels (S7, A2, D2, M2) and three alloy steels (4140, 4130, 4340) on hardness, toughness, machinability, and heat-treatment stability.",
        "In parallel, I led experimental torque and thrust testing of cutterhead layouts and blade geometries, measuring how many revolutions each took to climb through conditioned clay.",
        "I also helped select thrust bearings and a housing for the higher Z-axis load.",
      ],
      result: [
        "Selected 4140 for cost and manufacturability. A screen on the team's data sheet ruled out M2 (machinability and cost) and 4130/4340 (low hardness after heat treatment).",
        "Changing only the layout, the offset-control cutterhead needed 52% fewer revolutions to climb the same 1.5 in of conditioned clay (10.7 vs. 22.5, p ≈ 0.002, n = 3 per group). Blade-geometry differences weren't distinguishable from noise at this sample size.",
        "The new bearings and housing raised the safety factor and reduced motor load.",
      ],
      next: [
        "Pull the mill cert for our actual 4140 stock and write down the factors that really decided it — on paper, A2 and S7 rank higher unless cost carries most of the weight.",
        "Rerun the blade-geometry trials with more repeats in a single session, so blade design can be compared without session-to-session noise.",
      ],
    },
  },
  {
    slug: "boring-illini-muck-removal",
    specimen: "02",
    symbol: "Mr",
    label: "BORING ILLINI",
    title: "A closed-loop muck-removal system for a tunnel boring machine",
    org: "Boring Illini · 2027 competition",
    role: "Muck Removal Lead",
    dates: "May 2026 – present",
    team: "8 members",
    tools: ["Fusion 360", "Slurry transport calcs", "Pump selection", "System architecture"],
    outcome:
      "Leading the design of a closed-loop slurry system that pumps conditioned clay out of the machine and recycles clarified water back in.",
    categories: ["Engineering", "Leadership"],
    tags: ["Subsystem lead", "Slurry transport", "CAD"],
    cover: "muck-removal-cad",
    gallery: ["muck-removal-cad-underside"],
    published: true,
    caseStudy: {
      problem: [
        "A tunnel boring machine is only as fast as it can get the dirt out. Conditioned clay has to leave the cutterhead face continuously, without clogging a 2-inch line or stalling the machine.",
      ],
      approach: [
        "Closed-loop slurry circuit: a TW2H trash pump draws conditioned slurry from the muck chamber and pushes it to the portal at 97.9 gpm through 2-inch lay-flat hose. A second TW2H returns 95 gpm of clarified water from the separation tanks back into the chamber.",
        "Sized for a 10 ft/s target velocity at 2.69% solids by volume, for a 0.60 m cutterhead advancing at 3 cm/min.",
        "Crushing chamber instead of a cone crusher: a 12-sector ribbed housing around the cutterhead shaft, screened in the lower sectors, keeps every particle over 0.75 in out of the transport line. Sweeping arms keyed directly to the cutterhead shaft keep the screen clear — same RPM, no new motor or bearing set.",
        "Ground conditioning: 6 jet nozzles across the top 240°, delivering 0.5 gpm of 5% MasterRoc ACP 214 from 80 psi Seaflo pumps, so the clay doesn't blind the screen.",
        "Solids settle into dewatering bags in two 275-gallon IBC separation tanks; the water is reused in the loop.",
      ],
      result: [
        "Max particle size 0.75 in with a factor of safety of 2.67.",
        "No crusher-grade motor, bearings, or wear pair, and the screen stays clear without manual stops.",
      ],
      next: [],
    },
  },
  {
    slug: "dana-materials-coop",
    specimen: "03",
    symbol: "Da",
    label: "DANA INCORPORATED",
    title: "Materials engineering co-op",
    org: "Dana Incorporated",
    location: "Maumee, OH",
    role: "Materials Engineering Co-op",
    dates: "May – Aug 2026",
    team: "Materials lab, 2026 intern cohort",
    tools: [
      "Metallography",
      "Optical & stereo microscopy",
      "Hardness testing",
      "OES",
      "Magnetic particle inspection",
      "SEM / EDS / FTIR",
    ],
    outcome:
      "Ran materials and failure analysis on 25+ production components for OEMs including Ford, Toyota, Volvo, McLaren, and Lamborghini.",
    categories: ["Materials"],
    tags: ["Failure analysis", "Metallography", "Weld analysis"],
    cover: "dana-hq",
    gallery: [
      "dana-polisher",
      "dana-mounts",
      "dana-mount-pile",
      "dana-lab-selfie",
      "dana-plant-floor",
      "dana-interns",
      "dana-plant-letters",
    ],
    links: [{ label: "Final co-op presentation (PDF)", href: "/Nathan-Chan-Dana-Final-Presentation.pdf" }],
    published: true,
    confidential: true,
    caseStudy: {
      problem: [
        "Dana supplies components to automotive OEMs — Ford, Toyota, Volvo, McLaren, Lamborghini, and more — under a zero-defect quality standard. When a part is questioned, the lab has to show what it's made of, how it was processed, and whether it meets the drawing.",
      ],
      approach: [
        "Prepared metallurgical specimens — sectioning, mounting, grinding, polishing, and acid etching — for stereo and optical microscopy per industry standards.",
        "Verified properties and documented surface defects against spec with hardness testing, OES chemical composition analysis, and magnetic particle inspection.",
        "Analyzed microstructures and welds against engineering drawings, and investigated how upstream process and supplier changes affected weld quality.",
        "Got hands-on time with SEM, EDS, and FTIR.",
      ],
      result: [
        "Materials and failure analysis on 25+ production components, written up as technical reports for engineering teams and clients.",
        "Weld-quality findings turned into process-improvement recommendations that supported a 22% gain in production throughput.",
        "Implemented a lab-bench re-layout that doubled sample storage capacity and cut retrieval time by about 50%.",
      ],
      next: [],
    },
  },
  {
    slug: "caltech-hiam-electrodes",
    specimen: "04",
    symbol: "Hi",
    label: "CALTECH",
    title: "Printing battery electrodes, then turning them into metal",
    org: "Caltech · Greer Group",
    location: "Pasadena, CA",
    role: "Materials Science Researcher (high school research program)",
    dates: "Aug 2023 – May 2024",
    team: "5 San Marino High School students + a PhD mentor",
    tools: ["nTopology", "DLP printing", "HIAM", "Furnace processing", "SEM", "Cyclic voltammetry"],
    outcome:
      "Designed and fabricated micro-architected Li-ion battery electrodes by hydrogel infusion additive manufacturing, and helped extend them to Cu, CuNi, and high-entropy alloys.",
    categories: ["Materials"],
    tags: ["Research", "Additive manufacturing", "Batteries"],
    cover: "caltech-hydrogel-lattice",
    gallery: ["caltech-glovebox", "caltech-metal-lattices", "caltech-sem-screen"],
    published: true,
    caseStudy: {
      problem: [
        "Architected electrodes could pack more surface area into a battery than flat foils. But printing fine metal lattices directly is hard, and alloy choice is usually locked in before you print.",
      ],
      approach: [
        "Designed lattice electrodes in nTopology.",
        "Printed them as organogels by DLP vat photopolymerization, then ran the hydrogel infusion additive manufacturing (HIAM) chain: solvent exchange, aqueous metal-salt infusion, calcination, and forming-gas reduction.",
        "Because the metal goes in after printing, the same printed part can become Cu, CuNi, or a high-entropy alloy. I contributed to fabricating multi-material and alloy systems through post-print material selection and thermal processing.",
        "Checked morphology and structural integrity with SEM, and iterated lattice architectures from the results in weekly technical reviews with my PhD mentor.",
      ],
      result: [
        "Helped fabricate micro-architected electrodes in Cu, CuNi, and high-entropy alloys.",
        "Presented findings in regular technical reviews.",
      ],
      next: [],
    },
  },
  {
    slug: "mse-307-solidification",
    specimen: "05",
    symbol: "So",
    label: "MSE 307 · UIUC",
    title: "Watching alloys solidify, live under a microscope",
    org: "UIUC · MSE 307 Materials Laboratory",
    role: "Lab work & individual technical reports",
    dates: "Fall 2026",
    team: "Individual reports",
    tools: [
      "Hot-stage optical microscopy",
      "ImageJ",
      "Image processing",
      "Dilatometry",
      "Impulse excitation (ASTM E1876)",
      "Pyrometry",
      "Phase diagrams",
    ],
    outcome:
      "Filmed eutectic alloys solidifying under a hot-stage microscope for a 25-page report, then measured emissivity, CTE, modulus, and Peltier performance in three more labs.",
    categories: ["Materials"],
    tags: ["Microstructure", "Image analysis", "Characterization"],
    cover: "om-dendrites-cover",
    figures: ["om-transitions", "om-heating", "om-phase-fraction", "om-cooling-rates"],
    published: true,
    caseStudy: {
      problem: [
        "A micrograph usually shows you the end state of solidification. The interesting part — dendrites nucleating, eutectic growing — happens inside a casting where you can't watch it.",
        "Succinonitrile–camphor is a transparent organic alloy that solidifies like a metal, so I used it as a live analog for metal casting.",
      ],
      approach: [
        "Programmable hot stage plus reflected-light microscopy, with time-lapse imaging of hypo-, near-, and hyper-eutectic alloys (15, 23, and 35 wt% camphor). Nine runs: 3 compositions × 3 cooling rates (0.5, 1, and 10 °C/min).",
        "Built an image-analysis workflow: flat-field illumination correction → Otsu thresholding to get phase fractions and check them against the lever rule, plus manual dendrite-arm-spacing measurement in ImageJ.",
        "Three more labs covered thermal, optical, and elastic properties. Pyrometry: measured emissivity of graphite and 316 stainless with a pyroelectric detector and lock-in amplifier against a blackbody, linearizing Stefan–Boltzmann on log–log axes. Glass-to-metal seals: measured CTE by dilatometry and elastic modulus by impulse-excitation resonance (ASTM E1876) for soda-lime and borosilicate glass, Kovar, and titanium, then calculated residual stress to pick the safest pairing. Thermoelectrics: ran a Peltier module in cooling, heating, and balance modes, fitting ΔT = aI + bI² to separate Peltier pumping from Joule heating and estimating the figure of merit Z.",
      ],
      result: [
        "Eutectic melting matched the 38.3 °C phase-diagram value to within 0.5 °C. Nucleating the primary and eutectic phases took 4–13 °C of undercooling. Dendrite arm spacing ranged from 16 to 66 µm.",
        "The key insight: melting followed the equilibrium phase diagram, but solidification undercooled heavily, so most of it happened during isothermal holds. That's why the microstructure didn't simply refine at faster nominal cooling rates — a real lesson for process control.",
        "Graphite emissivity came out at ε = 0.799, inside the 0.78–0.90 literature range (N = 3.8 vs. a theoretical 4).",
        "Elastic modulus within 3% for every material, and within 0.1% for titanium and borosilicate. Recommended a borosilicate–Kovar seal.",
        "Peltier coefficients matched to 0.4% between cooling and heating modes (49.9 vs. 50.1 K/A). Still in progress.",
      ],
      next: [
        "Recover the textbook trend: cool continuously through solidification (a lower hold temperature, or seeding to suppress undercooling), run every rate on a single station, and image more fields per condition — field-to-field variation (up to 58%) was bigger than the cooling-rate effect.",
      ],
    },
  },
  {
    slug: "boring-illini-acp-system",
    specimen: "06",
    symbol: "Sc",
    label: "BORING ILLINI",
    title: "Soil-conditioning dispensing system",
    org: "Boring Illini · 2026 competition",
    role: "Project Lead",
    dates: "Jan – May 2026",
    team: "",
    tools: ["Fusion 360", "Digital metering pumps", "Engineering calcs", "BOM", "Test planning"],
    outcome:
      "Led the design of a 3-nozzle soil-conditioning system that meters MasterRoc ACP 214 into the muck funnel to stop sticky clay from clogging the cutterhead.",
    categories: ["Engineering", "Leadership"],
    tags: ["Project lead", "System design", "CAD"],
    cover: "acp-bench-test",
    cad: {
      embed: "https://illinois2002.autodesk360.com/shares/public/SH28cd1QT2badd0ea72b6e52edcfdbfc20cb?mode=embed",
      share: "https://a360.co/47qBkZG",
      poster: "acp-cad-poster",
    },
    published: true,
    caseStudy: {
      problem: [
        "In medium-to-high-cohesion soils, muck sticks to the cutterhead, clogs it, and spikes torque. Conditioning the soil as you cut is how full-scale tunnel boring machines deal with this.",
      ],
      approach: [
        "Goals: condition the soil for smoother muck removal, keep the cutterhead clean, stop clay from agglomerating, and cut downtime from clogging and cleaning.",
        "Designed the system architecture around a simplified flow path to cut part count, cost, and failure modes: a 32-gallon tank feeds a 22-series Seaflo pump, through a 3-way bypass valve and a 0.05–0.5 gpm flowmeter, to a 4-way splitter and three nozzles on the muck funnel.",
        "Chose digital metering pumps over commercial dosing pumps to keep cost down while still getting the right flow range with accurate real-time readings.",
        "Placed and mounted the nozzles within the vertical boring machine's geometry, and helped develop the CAD for the nozzle mounts.",
        "Owned the BOM, engineering calculations, sponsor acquisition, and the calibration and testing plan ahead of procurement.",
      ],
      result: [
        "Delivered the BOM, engineering calculations, and the calibration and testing plan ahead of procurement, with calibration on the full 3-nozzle system as the next step before competition.",
        "The lessons carried straight into this year's design — see the muck-removal subsystem.",
      ],
      next: [],
    },
  },
  {
    slug: "eoh-technology",
    specimen: "07",
    symbol: "Eo",
    label: "EOH ILLINOIS",
    title: "Building the site and first app for EOH",
    org: "Engineering Open House",
    role: "Junior → Senior Director of Technology",
    dates: "Sept 2025 – present",
    team: "",
    tools: ["React", "Next.js", "TypeScript", "Firebase", "Expo"],
    outcome:
      "Leading full-stack development of eohillinois.org and the first interactive EOH app for 30,000+ annual visitors.",
    categories: ["Software", "Leadership"],
    tags: ["Full-stack", "React / Next.js", "Mobile"],
    note: "This portfolio is built with the same stack.",
    cover: "eoh-booth",
    gallery: ["eoh-night", "eoh-soldering"],
    links: [
      { label: "eohillinois.org", href: "https://www.eohillinois.org/" },
      { label: "EOH 2026 site (archived)", href: "https://2026.eohillinois.org/" },
      { label: "EOH 2026 app — App Store", href: "https://apps.apple.com/us/app/eoh-2026/id6761497720" },
    ],
    figures: ["eoh-logo-2026"],
    published: true,
    caseStudy: {
      problem: [
        "Engineering Open House is the nation's largest student-run science fair, with 30,000+ visitors every year. They need to find exhibits, schedules, and their way around campus.",
      ],
      approach: [
        "Selected as one of two freshmen on the EOH committee.",
        "Leading full-stack development of eohillinois.org and the first interactive EOH app in React/Next.js, TypeScript, Firebase, and Expo.",
        "Co-designed the backend and frontend of eohillinois.org so the site handles 30,000+ annual visitors during EOH.",
      ],
      result: [
        "Shipped the EOH 2026 app on the App Store and the 2026 site, now archived at 2026.eohillinois.org.",
        "eohillinois.org carries EOH's 30,000+ annual visitors.",
      ],
      next: [],
    },
  },
  {
    slug: "vartm-composites",
    specimen: "08",
    symbol: "Cf",
    label: "COMPOSITES",
    title: "Carbon-fiber composites by VARTM",
    org: "TODO(nathan): class / lab / club",
    role: "TODO(nathan)",
    dates: "",
    team: "",
    tools: ["VARTM", "Vacuum bagging", "Resin curing"],
    outcome:
      "Hands-on vacuum-assisted resin transfer molding: laying up and infusing carbon-fiber panels, curing resin, and studying where composites get used.",
    categories: ["Materials", "Engineering"],
    tags: ["Composites", "VARTM", "Fabrication"],
    cover: "vartm-layup",
    published: true,
  },
  {
    slug: "hoeft-tm",
    specimen: "09",
    symbol: "Tm",
    label: "HOEFT T&M",
    title: "Hoeft Technology & Management Program",
    org: "University of Illinois",
    role: "Hoeft Technology & Management Minor",
    dates: "Aug 2026 – present",
    team: "Engineering + business cohort",
    tools: [],
    outcome:
      "A selective minor that puts engineering and business students on the same teams to build products and learn how technology companies are run.",
    categories: ["Leadership"],
    tags: ["Business", "Minor"],
    cover: "tm-makerspace",
    published: true,
  },
  {
    slug: "hea-hardness-ml",
    specimen: "10",
    symbol: "He",
    label: "IN PROGRESS",
    title: "Predicting high-entropy-alloy hardness from composition with ML",
    org: "Independent",
    role: "TODO(nathan)",
    dates: "In progress",
    team: "TODO(nathan)",
    tools: ["Python"],
    outcome: "TODO(nathan)",
    categories: ["Materials", "Software"],
    tags: ["Machine learning", "High-entropy alloys"],
    published: false, // flip to true when it's done
    caseStudy: {
      problem: ["TODO(nathan)"],
      approach: ["TODO(nathan)"],
      result: ["TODO(nathan)"],
      next: ["TODO(nathan)"],
    },
  },
];

export const publishedProjects = projects.filter((p) => p.published);

// Flagship comparison for the cutterhead case study — values exactly as compiled
// in the team's "Blade Materials" sheet (Online Metals product guide).
export const steelCriteria = [
  "Hardness after heat treat",
  "UTS, hardened",
  "Machinability",
  "Heat-treat stability",
] as const;

export const steelTradeStudy: {
  steel: string;
  family: "Tool steel" | "Alloy steel";
  values: string[]; // same order as steelCriteria
  verdict: string;
  selected?: boolean;
}[] = [
  {
    steel: "S7",
    family: "Tool steel",
    values: ["HRC 55–57", "290 ksi", "95%", "Very stable (air or oil)"],
    verdict: "Passed screen",
  },
  {
    steel: "A2",
    family: "Tool steel",
    values: ["HRC 59–62", "~300 ksi", "65%", "Excellent (air hardening)"],
    verdict: "Passed screen",
  },
  {
    steel: "D2",
    family: "Tool steel",
    values: ["HRC 59–62", "290 ksi", "50%", "Very good, low distortion"],
    verdict: "Passed screen",
  },
  {
    steel: "M2",
    family: "Tool steel",
    values: ["HRC 61–66", "310 ksi", "39%", "Stable"],
    verdict: "Ruled out: machinability + cost",
  },
  {
    steel: "4140",
    family: "Alloy steel",
    values: ["HRC 28–32 (Q&T)", "150–200 ksi", "65–70%", "Oil quench; can warp"],
    verdict: "Selected: manufacturability + cost",
    selected: true,
  },
  {
    steel: "4130",
    family: "Alloy steel",
    values: ["HRB 92", "97 ksi (normalized)", "Good (annealed)", "Moderate; can distort"],
    verdict: "Ruled out: low hardness",
  },
  {
    steel: "4340",
    family: "Alloy steel",
    values: ["HRB 100", "186 ksi (normalized)", "50%", "Good, minimal distortion"],
    verdict: "Ruled out: low hardness",
  },
];
