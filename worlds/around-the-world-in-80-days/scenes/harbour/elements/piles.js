// The piles the pier, the jetty and the tavern stand on, from the water up to their decks — each a part where it stands,
// green with weed at the water.
const P = e.lib.plan;
const at = [];
for (let d = 8; d < P.pier.to; d += 4) for (const s of [-1, 1]) at.push([P.pier.across + (s * P.pier.w) / 2, d]);
for (let x = P.jetty.from; x <= P.jetty.to; x += 4) for (const d of P.jetty.d) at.push([x, d]);
for (let d = 8; d <= P.tavern.d + P.tavern.deep; d += 3) for (const x of [P.terrace.from, P.terrace.to]) at.push([x, d]);
for (const p of at) {
  e.part(p[0], p[1] - 30, g => {
    g.fillStyle = '#3a3026';
    g.fillRect(-0.15, -1.6, 0.3, 1.6);
    g.fillStyle = 'rgba(20,40,40,0.5)';
    g.fillRect(-0.15, -0.5, 0.3, 0.5);
  });
}
