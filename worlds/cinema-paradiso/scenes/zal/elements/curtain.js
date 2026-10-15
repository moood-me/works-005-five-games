// The velvet curtain in the side door, seen from the corridor (its x along the door from the north jamb toward the
// south, 1.3 m — closed to within 0.7 m of the south jamb): it hangs from its ring at the jamb and is pushed aside
// into the corridor by the boy's hand as `peek` grows — the card turns about the jamb (`curtain_f`, the script's).
// Its free edge is the point his hand goes to. Gone in 1988.
if (e.state.era === 'ruin') return;
g.fillStyle = '#6a1f24'; g.fillRect(0, -2.6, 1.3, 2.58);
for (let k = 0; k < 10; k++) {
  const x = k * 0.13;
  g.fillStyle = k % 2 ? '#7a262c' : '#5a1a20';
  g.beginPath(); g.moveTo(x, -2.6); g.quadraticCurveTo(x + 0.04, -1.3, x + 0.02, -0.02); g.lineTo(x + 0.08, -0.02); g.quadraticCurveTo(x + 0.1, -1.3, x + 0.07, -2.6); g.closePath(); g.fill();
}
g.fillStyle = '#3a0f12'; g.fillRect(0, -0.12, 1.3, 0.1);
g.fillStyle = '#7a5a3a'; g.fillRect(0, -2.62, 1.3, 0.04);
g.fillStyle = '#2a1c14'; g.fillRect(-0.05, -2.66, 0.08, 0.1);
e.at(1.25, -1.2, 'edge');
e.at(1.4, -1.3, 'gap');
