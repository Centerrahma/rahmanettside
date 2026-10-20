/** The coming Friday in Oslo (today, if it is Friday): «23» and «okt». */
export function nextFriday(now = new Date()) {
  const oslo = (d: Date, o: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('nb-NO', { timeZone: 'Europe/Oslo', ...o }).format(d);
  for (let i = 0; i < 7; i++) {
    const d = new Date(now.getTime() + i * 86_400_000);
    if (oslo(d, { weekday: 'long' }) === 'fredag') {
      return { day: oslo(d, { day: 'numeric' }).replace('.', ''), month: oslo(d, { month: 'short' }).replace('.', '') };
    }
  }
  return null;
}
