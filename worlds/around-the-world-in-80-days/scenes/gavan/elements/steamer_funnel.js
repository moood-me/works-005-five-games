// The steamer's funnel, round (a card facing the eye): black for the "Carnatic"; red with a black top for the "General
// Grant"; shaded as a drum. Its top (steamer_funnel#funnel) is where her smoke comes out.
const L = e.lib;
const S = L.plan.steamer;
const yoko = L.portOf(e.state) === 'yokohama';
const h = S.funnel[1] - S.deck;
const r = 1.3;
const gr = g.createLinearGradient(-r, 0, r, 0);
const base = yoko ? '#9a3a2a' : '#26282c';
gr.addColorStop(0, L.rgba(L.mixc(base, '#000000', 0.45)));
gr.addColorStop(0.35, L.rgba(L.mixc(base, '#ffffff', 0.12)));
gr.addColorStop(1, L.rgba(L.mixc(base, '#000000', 0.3)));
g.fillStyle = gr;
g.fillRect(-r, -h, 2 * r, h);
g.fillStyle = '#16171a';
g.fillRect(-r, -h, 2 * r, yoko ? 1.6 : 0.5);
// the steam pipe beside it
g.fillStyle = '#3a3a3a';
g.fillRect(r + 0.1, -h + 0.6, 0.18, h - 0.6);
e.at(0, -h, 'funnel');
