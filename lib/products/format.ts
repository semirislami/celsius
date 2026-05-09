export function formatMkd(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return new Intl.NumberFormat("mk-MK", {
    maximumFractionDigits: 0,
    useGrouping: true
  })
    .format(Math.round(n))
    .replace(/ /g, ".");
}
