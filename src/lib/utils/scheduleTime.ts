/**
 * Parse a course time string like "MW 10:00 AM - 11:15 AM" into day indices and minutes from midnight.
 * Used only for calendar placement. Backend can provide structured data instead.
 */
const DAY_INDEX: Record<string, number> = { M: 0, T: 1, W: 2, R: 3, F: 4 };

export interface ParsedMeeting {
  readonly dayIndices: ReadonlyArray<number>;
  readonly startMinutes: number;
  readonly endMinutes: number;
}

export function parseCourseTime(timeStr: string): ReadonlyArray<ParsedMeeting> | null {
  const s = timeStr.trim();
  if (!s) return null;
  const match = s.match(
    /^([MTWRF]+)\s+(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)$/i
  );
  if (!match) return null;
  const [, daysStr, sh, sm, sAmPm, eh, em, eAmPm] = match;
  const startMinutes = toMinutes(parseInt(sh, 10), parseInt(sm, 10), sAmPm.toUpperCase() === 'PM');
  const endMinutes = toMinutes(parseInt(eh, 10), parseInt(em, 10), eAmPm.toUpperCase() === 'PM');
  if (startMinutes >= endMinutes) return null;
  const dayIndices: number[] = [];
  const seen = new Set<number>();
  for (const char of daysStr.toUpperCase()) {
    const idx = DAY_INDEX[char];
    if (idx !== undefined && !seen.has(idx)) {
      seen.add(idx);
      dayIndices.push(idx);
    }
  }
  dayIndices.sort((a, b) => a - b);
  if (dayIndices.length === 0) return null;
  return [{ dayIndices, startMinutes, endMinutes }];
}

function toMinutes(h: number, m: number, pm: boolean): number {
  if (pm && h !== 12) h += 12;
  if (!pm && h === 12) h = 0;
  return h * 60 + m;
}

export const CALENDAR_START_HOUR = 8;
export const CALENDAR_END_HOUR = 17;
