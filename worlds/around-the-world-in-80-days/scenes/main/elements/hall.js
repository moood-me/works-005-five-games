// The hall beyond the doorway: warm light falling from above, a far doorway, its floor bright near the
// threshold. It is its own light: seen through the opening as the door opens (and through the crack round
// the leaves when shut), it lights the salon by as much as the door is open ("lights": hall).
const h = e.lib.plan.door.h;
const w = e.lib.plan.door.w + 0.4;
const hg = g.createLinearGradient(0, -h, 0, 0);
hg.addColorStop(0, '#6b4024');
hg.addColorStop(0.55, '#b9773f');
hg.addColorStop(1, '#f0c28a');
g.fillStyle = hg;
g.fillRect(-w / 2, -h - 0.2, w, h + 0.2);
g.fillStyle = 'rgba(60,34,20,0.55)';
g.fillRect(-0.5, -2.7, 1.2, 2.45);
g.fillStyle = 'rgba(255,226,180,0.35)';
g.fillRect(-w / 2, -0.35, w, 0.35);
e.light(0, -h * 0.45, 4.5, '#ffbe78', 0.6, 'light');
