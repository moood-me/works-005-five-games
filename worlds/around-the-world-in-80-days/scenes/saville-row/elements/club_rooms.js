// The club's rooms seen through its windows (glows): the hall behind the doorway, the great saloon on the first floor
// under its chandeliers, the library above. Painted once, twice: as they are unlit (dim, by day), and lit by the gas (the
// layer 'lit') with the chandeliers' glow (the layer 'chandeliers'); the shader shows them as lit as the gas is (its
// animate: `gas`). Their light falls out on the forecourt and the steps (club_rooms#hall, #saloon).
const L = e.lib;
const P = L.plan;
const half = P.club.half;
const floors = (g, top, bottom) => P.clubFloors.forEach(([sill, h], i) => {
  const gr = g.createLinearGradient(0, -sill - h, 0, -sill);
  gr.addColorStop(0, top[i]);
  gr.addColorStop(1, bottom[i]);
  g.fillStyle = gr;
  g.fillRect(-half, -sill - h - 0.4, 2 * half, i ? h + 0.8 : sill + h + 0.4);
});
floors(g, ['#3e3a34', '#3e3a34', '#3e3a34'], ['#2e2b27', '#2e2b27', '#2e2b27']);
e.layer('lit', {}, g => floors(g, ['#f0c88e', '#ffdcaa', '#e6b47a'], ['#b88a58', '#d8a66e', '#a87a4e']));
e.layer('chandeliers', { blend: 'add' }, g => { for (const x of P.clubBays) e.kit.light.glow(g, x, -9.6, 1.2, '#fff0cc', 0.5); });
e.light(0, -2.6, 1.2, '#ffd59a', 0.8, 'hall');
e.light(0, -9.0, 2.0, '#ffd8a0', 0.7, 'saloon');
