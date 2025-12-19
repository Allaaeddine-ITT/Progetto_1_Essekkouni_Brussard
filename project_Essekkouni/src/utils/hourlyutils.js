export function getHoursForDay(hourly, dayDate) {
  if (!Array.isArray(hourly) || !dayDate) return [];

  const target = dayDate.slice(0, 10); // YYYY-MM-DD

  return hourly
    .filter((h) => h?.time?.startsWith(target))
    .slice(0, 24);
}
