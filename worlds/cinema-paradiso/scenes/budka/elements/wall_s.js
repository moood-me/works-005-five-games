// the wall opposite the ports (seen from the room; its +x is the room's left): plaster, a skirting, a coat hook
const L = e.lib, ruin = e.state.era === 'ruin';
L.plaster(g, -2.1, -2.7, 4.2, 2.75, ruin ? '#7c7266' : '#7d6a54', 43, ruin);
g.fillStyle = '#3e3024'; g.fillRect(-2.1, -0.12, 4.2, 0.12);
// (its +x is the room's left: a hook with Alfredo's old jacket and cap at x 0.6, a small framed photograph at x −0.3)
if (!ruin) {
  g.fillStyle = '#2a2420'; g.fillRect(-0.62, -1.78, 0.04, 0.05);
  g.fillStyle = '#3e3a34'; g.beginPath(); g.moveTo(-0.6, -1.74); g.lineTo(-0.82, -1.62); g.lineTo(-0.86, -1.0); g.lineTo(-0.34, -1.0); g.lineTo(-0.38, -1.62); g.closePath(); g.fill();
  g.fillStyle = '#2e2a26'; g.fillRect(-0.62, -1.42, 0.04, 0.42);
  g.fillStyle = '#34302c'; g.beginPath(); g.ellipse(-0.6, -1.8, 0.11, 0.05, 0, Math.PI, 0); g.fill(); g.fillRect(-0.7, -1.81, 0.2, 0.02);
}
g.fillStyle = '#4a3a2a'; g.fillRect(0.18, -1.72, 0.26, 0.32);
g.fillStyle = ruin ? '#8a8478' : '#c2b49a'; g.fillRect(0.21, -1.69, 0.2, 0.26);
g.fillStyle = 'rgba(40,34,30,0.7)'; g.beginPath(); g.ellipse(0.31, -1.6, 0.04, 0.05, 0, 0, Math.PI * 2); g.fill(); g.fillRect(0.25, -1.55, 0.12, 0.12);
