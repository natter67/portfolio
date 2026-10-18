// Strava training log, fetched once at build time (the site is static).
// Needs STRAVA_CLIENT_ID, STRAVA_CLIENT_SECRET, STRAVA_REFRESH_TOKEN — see
// README → "Strava logbook". Without them this returns null and the section is
// hidden. Only aggregates are exposed: no maps, routes, or start locations.

const WEEKS = 12;

type Activity = {
  sport_type: string;
  distance: number; // m
  moving_time: number; // s
  start_date: string;
};

export type Logbook = {
  weeks: { start: string; hours: number }[]; // oldest → newest
  totals: { sport: string; count: number; km: number; hours: number }[];
  sessions: number;
  hours: number;
  updated: string;
};

const SPORT: Record<string, string> = {
  Swim: "Swim",
  Run: "Run",
  TrailRun: "Run",
  Ride: "Ride",
  GravelRide: "Ride",
  MountainBikeRide: "Ride",
  VirtualRide: "Ride",
  WeightTraining: "Lift",
  Workout: "Train",
  Hike: "Hike",
  Walk: "Walk",
};

export async function getLogbook(): Promise<Logbook | null> {
  const { STRAVA_CLIENT_ID: id, STRAVA_CLIENT_SECRET: secret, STRAVA_REFRESH_TOKEN: refresh } = process.env;
  if (!id || !secret || !refresh) return null;

  try {
    const tok = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ client_id: id, client_secret: secret, grant_type: "refresh_token", refresh_token: refresh }),
    }).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`token ${r.status}`))));

    // Start of the week WEEKS-1 weeks ago (Monday 00:00 UTC).
    const now = new Date();
    const monday = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() - ((now.getUTCDay() + 6) % 7)));
    const since = new Date(monday.getTime() - (WEEKS - 1) * 7 * 864e5);

    const acts: Activity[] = [];
    for (let page = 1; page <= 5; page++) {
      const batch: Activity[] = await fetch(
        `https://www.strava.com/api/v3/athlete/activities?after=${Math.floor(since.getTime() / 1000)}&per_page=100&page=${page}`,
        { headers: { Authorization: `Bearer ${tok.access_token}` } },
      ).then((r) => (r.ok ? r.json() : Promise.reject(new Error(`activities ${r.status}`))));
      acts.push(...batch);
      if (batch.length < 100) break;
    }

    const weeks = Array.from({ length: WEEKS }, (_, i) => ({
      start: new Date(since.getTime() + i * 7 * 864e5).toISOString().slice(0, 10),
      hours: 0,
    }));
    const by = new Map<string, { count: number; km: number; hours: number }>();
    for (const a of acts) {
      const w = Math.floor((new Date(a.start_date).getTime() - since.getTime()) / (7 * 864e5));
      if (w >= 0 && w < WEEKS) weeks[w].hours += a.moving_time / 3600;
      const sport = SPORT[a.sport_type] ?? "Other";
      const t = by.get(sport) ?? { count: 0, km: 0, hours: 0 };
      t.count += 1;
      t.km += a.distance / 1000;
      t.hours += a.moving_time / 3600;
      by.set(sport, t);
    }

    return {
      weeks: weeks.map((w) => ({ ...w, hours: Math.round(w.hours * 10) / 10 })),
      totals: [...by.entries()]
        .map(([sport, t]) => ({ sport, count: t.count, km: Math.round(t.km), hours: Math.round(t.hours * 10) / 10 }))
        .sort((a, b) => b.hours - a.hours),
      sessions: acts.length,
      hours: Math.round(acts.reduce((s, a) => s + a.moving_time, 0) / 360) / 10,
      updated: now.toISOString().slice(0, 10),
    };
  } catch (e) {
    // Never fail the build over Strava.
    console.warn("[strava] skipped:", (e as Error).message);
    return null;
  }
}
