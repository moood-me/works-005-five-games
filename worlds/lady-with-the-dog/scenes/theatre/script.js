// The theatre in S.: the scene's mechanics. Its film in beats (lib.js film(scene), played by the world's module beats);
// the ladies come in by `enter` (each next one walks down the middle aisle to her seat and sits; Anna raises her
// lorgnette to a box); the landing's door leaf turns by `door`.
const L = scene.lib;
scene.kit.beats.play(scene, L.film(scene));

const runs = {};
function enter() {
  const n = Math.round(Number(scene.get('enter')) || 0);
  L.ORDER.forEach((id, i) => {
    if (i >= n) { runs[id]?.cancel(); delete runs[id]; return; }
    if (runs[id] || scene.get(`${id}_on`)) return;
    const [row, x] = L.SEATS[id], z = L.G.rowZ(row), lane = z + L.G.LANE;
    runs[id] = scene.sequence(async s => {
      const p = s.person(id);
      p.here(true);
      await p.walk([[L.G.AISLE, lane], [x, lane]]);
      await p.go('sit_down', { to: [x, z], turn: 0 });
      p.on(L.G.seat(row, x));
      p.do('seated');
      if (id === 'anna') {
        p.look([-6.2, 13.2, 3.4]);
        p.reach({ r: [x - 0.08, z + 0.26, 1.12] });
      }
    }, { name: `enter_${id}` });
  });
}
scene.on('change', 'enter', enter);
enter();

function door() { scene.set('door_f', 180 + 82 * L.clamp01(scene.get('door'))); }
scene.on('change', 'door', door);
scene.on('move', 'door', door);
door();
