// Field notes — short write-ups, one problem each. Newest first.
// Body blocks: plain paragraphs, or { figure } with a photo id from content/photos.ts.

export type Block = string | { figure: string; caption: string };

export type Note = {
  slug: string;
  date: string; // "Oct 2026"
  title: string;
  dek: string; // one-line summary for the index
  body: Block[];
  related?: { label: string; href: string };
};

export const notes: Note[] = [
  {
    slug: "the-steel-we-picked-lost-the-trade-study",
    date: "Oct 2026",
    title: "The steel we picked lost the trade study",
    dek: "We built our cutterhead blades from 4140. When I rebuilt the decision as a weighted matrix, 4140 came third.",
    body: [
      "Boring Illini's cutterhead subteam compared seven steels for the blades: four tool steels (S7, A2, D2, M2) and three alloy steels (4140, 4130, 4340). We picked 4140. Months later I rebuilt that decision in Python to see whether the data actually backed it.",
      "The first stage reproduces what our sheet already said. M2 is out on machinability and cost. 4130 and 4340 are out on hardness after heat treatment. That leaves S7, A2, D2, and 4140.",
      "The second stage ranks the survivors on machinability, cost, and post-heat-treat hardness, weighted equally. S7 scores 0.62, A2 0.56, 4140 0.46, D2 0.33. On our own numbers, 4140 has the lowest hardness of the four (about HB 300 against 560–690 for the tool steels), and our sheet calls it the one most likely to warp in the quench.",
      "4140 only wins if cost carries at least 44% of the weight. That might be the honest answer: we're a student team, and cheap, easy-to-machine stock matters. But that isn't what we wrote down. We said 4140 was chosen for cutting performance after heat treatment, and the data doesn't support that.",
      "The lesson I took: write down the real reason while you're making the decision. Stock on hand, whether we could buy it pre-hardened, and whether we could heat-treat it ourselves probably mattered more than anything in the table. None of it was recorded, so none of it can be checked.",
    ],
    related: { label: "Trade study & statistics on GitHub", href: "https://github.com/natter67/blade_trade_study" },
  },
  {
    slug: "change-one-thing-at-a-time",
    date: "Oct 2026",
    title: "Change one thing at a time",
    dek: "How much did the new cutterhead layout actually help? Depends which trials you compare — and which you trust.",
    body: [
      "We tested cutterhead layouts by counting how many revolutions it took to climb through 1.5 inches of conditioned clay. Fewer revolutions means the head is cutting, not smearing.",
      "Comparing the original layout to the offset-control layout with the same blade, the average dropped from 22.5 to 10.7 revolutions: 52% fewer, p ≈ 0.002 with three trials each. That number excludes one original-layout trial the team flagged at the time as a possible error. Leave it in and the drop is 58%, but the p-value weakens to about 0.05 because that one trial is so far off.",
      "You can get a bigger number by comparing the original layout with one blade against the new layout with a different blade. But that changes two things at once, so you can't say which one did the work. And when I held the layout fixed and compared the three blade designs, I couldn't tell them apart at all (ANOVA p ≈ 0.70).",
      "There was a quieter problem too. The blade-design trials ran in a different session, at a noticeably faster rotation speed than the layout trials. So even the blade comparison carries some session-to-session noise.",
      "What I'd do next: more repeats per configuration, all in one session, with the flag criteria decided before testing instead of after.",
    ],
    related: { label: "Cutterhead case study", href: "/work/boring-illini-cutterhead-steel/" },
  },
  {
    slug: "faster-cooling-didnt-refine-the-structure",
    date: "Oct 2026",
    title: "Faster cooling didn't refine the structure",
    dek: "The textbook says cool faster, get finer dendrites. Our hot-stage runs mostly said the opposite, and the reason was undercooling.",
    body: [
      "In MSE 307 we solidified succinonitrile–camphor alloys under a hot-stage microscope. It's a transparent organic alloy that freezes like a metal, so you can watch dendrites grow instead of only seeing the end state.",
      { figure: "bench-35-10c", caption: "35 wt% camphor cooled at 10 °C/min — the one condition that refined the way the textbook predicts." },
      "The textbook expectation is that faster cooling gives finer dendrite arm spacing. In the 15 wt% alloy we measured 47, 49, and 66 µm at 0.5, 1, and 10 °C/min: coarser, not finer. Only the 35 wt% alloy at 10 °C/min came out finer, about 16 µm against 28 µm at the slowest rate.",
      "The time-lapse explained it. The alloys undercooled by 4–13 °C before anything nucleated, so in most runs the primary phase didn't form during the controlled ramp at all. It formed during the hold at 35 °C, or in the final quench. The nominal cooling rate on the controller wasn't the rate the solid actually grew at.",
      "Field-to-field variation in a single sample was up to 58%, bigger than the effect we were trying to measure. To recover the textbook trend I'd cool continuously through solidification, run every rate on one station, and image more fields per condition.",
    ],
    related: { label: "MSE 307 case study", href: "/work/mse-307-solidification/" },
  },
];
