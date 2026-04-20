export function getTimeOfDay(date = new Date()): "morning" | "afternoon" | "evening" {
  const h = date.getHours();
  if (h < 12) return "morning";
  if (h < 18) return "afternoon";
  return "evening";
}

export function buildGreeting(name: string | null, date = new Date()): string {
  const tod = getTimeOfDay(date);
  const base =
    tod === "morning" ? "Good morning" : tod === "afternoon" ? "Good afternoon" : "Good evening";
  return name ? `${base}, ${name}` : base;
}
