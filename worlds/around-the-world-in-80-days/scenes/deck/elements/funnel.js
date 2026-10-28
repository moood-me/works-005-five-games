// The funnel through the deckhouse, seen from aft: the stack in the ship's colour (the P&O's black; the «General
// Grant»'s red, its top black; the «Henrietta»'s black with a red band), its rim, the steam pipe beside it, two stays.
// Its point funnel#top — where the smoke and the sparks come out.
const L = e.lib, c = L.colours(e.state), F = L.plan.funnel;
L.line(g, [[-0.9, -F.top + 1.5], [-1.38, 0]], '#3a342c', 0.04);
L.line(g, [[0.9, -F.top + 1.5], [1.38, 0]], '#3a342c', 0.04);
L.rect(g, -F.r, -F.top, 2 * F.r, F.top, c.funnel);
// rounded: its edges a shade darker
L.rect(g, -F.r, -F.top, 0.18, F.top, L.shade(c.funnel, 0.25));
L.rect(g, F.r - 0.18, -F.top, 0.18, F.top, L.shade(c.funnel, 0.25));
L.rect(g, -F.r, -F.top, 2 * F.r, 1.4, c.band);
L.rect(g, -F.r - 0.08, -F.top - 0.15, 2 * F.r + 0.16, 0.2, L.shade(c.funnel, 0.4));
L.rect(g, F.r + 0.05, -F.top + 0.6, 0.12, F.top - 0.6, '#9a8c74');
e.at(0, -F.top, 'top');
