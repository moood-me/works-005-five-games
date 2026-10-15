// The armchair by the wall, turned a little toward the room: worn grey-green upholstery, dark wooden arms (metres,
// origin at its foot's middle). Its point `leash` is on the top of its back: the spitz's red leash lies over it.
g.fillStyle = '#3a2a20';
for (const x of [-0.38, 0.34]) g.fillRect(x, -0.18, 0.05, 0.18);
g.fillStyle = '#69705f';
g.beginPath(); g.moveTo(-0.34, -0.45); g.lineTo(-0.36, -1.0); g.quadraticCurveTo(0, -1.1, 0.36, -1.0); g.lineTo(0.34, -0.45); g.closePath(); g.fill();
g.fillStyle = '#737a68'; g.fillRect(-0.4, -0.5, 0.8, 0.32);
g.fillStyle = '#4a3326';
g.fillRect(-0.46, -0.66, 0.1, 0.48); g.fillRect(0.36, -0.66, 0.1, 0.48);
g.fillStyle = 'rgba(40,46,36,0.3)'; for (let x = -0.25; x < 0.3; x += 0.18) g.fillRect(x, -0.98, 0.02, 0.48);
e.at(0.12, -1.05, 'leash');
