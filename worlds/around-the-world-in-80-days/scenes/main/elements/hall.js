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
// the dado: panelling below a rail, darker
g.fillStyle = 'rgba(90,52,28,0.45)';
g.fillRect(-w / 2, -1.0, w, 1.0);
g.fillStyle = 'rgba(255,214,160,0.45)';
g.fillRect(-w / 2, -1.04, w, 0.05);
// the far doorway: its architrave, light, and the darker room beyond with a panelled leaf standing half open
g.fillStyle = 'rgba(250,214,160,0.7)';
g.fillRect(-0.62, -2.82, 1.44, 2.6);
g.fillStyle = 'rgba(60,34,20,0.7)';
g.fillRect(-0.5, -2.7, 1.2, 2.48);
g.fillStyle = 'rgba(120,72,38,0.9)';
g.fillRect(0.28, -2.66, 0.38, 2.42);
g.strokeStyle = 'rgba(60,34,20,0.6)';
g.lineWidth = 0.025;
g.strokeRect(0.34, -2.5, 0.26, 0.95);
g.strokeRect(0.34, -1.35, 0.26, 0.95);
// a sconce on the wall left of it: its bracket and its glass (the hall's light is its own — e.light below)
g.fillStyle = 'rgba(70,44,22,0.9)';
g.fillRect(-1.05, -2.25, 0.05, 0.3);
g.fillStyle = 'rgba(255,236,190,0.95)';
g.beginPath();
g.ellipse(-1.025, -2.36, 0.07, 0.11, 0, 0, Math.PI * 2);
g.fill();
g.fillStyle = 'rgba(255,226,180,0.35)';
g.fillRect(-w / 2, -0.35, w, 0.35);
e.light(0, -h * 0.45, 4.5, '#ffbe78', 0.6, 'light');
