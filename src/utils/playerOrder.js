/**
 * Returns players in their display order.
 * Uses sort_order if any player has one set (from drag-and-drop reordering),
 * otherwise falls back to starters-by-number then bench-by-number.
 */
export function getOrderedPlayers(players) {
  if (!players || players.length === 0) return [];

  const hasCustomOrder = players.some(p => p.sort_order != null);
  if (hasCustomOrder) {
    return [...players].sort((a, b) => (a.sort_order ?? 999) - (b.sort_order ?? 999));
  }

  const starters = players.filter(p => p.is_starter).sort((a, b) => a.number - b.number);
  const bench = players.filter(p => !p.is_starter).sort((a, b) => a.number - b.number);
  return [...starters, ...bench];
}
