// The bare bulb over the door under the canopy; its glow `bulb` follows `porch_light` (animate).
g.fillStyle = '#2b2622';
g.fillRect(-0.02, -0.28, 0.04, 0.18);
g.fillStyle = '#fff2cf';
g.beginPath();
g.arc(0, -0.06, 0.05, 0, Math.PI * 2);
g.fill();
e.light(0, -0.06, 0.25, '#f2c27e', 1.4, 'bulb');
