// The electric train far off beyond the gardens: a dark low body, a long row of lit windows, the headlamp in front.
// It glows (the scene's light does not darken its windows). Metres; 14 long, it runs to the right (far_train_x).
g.fillStyle = '#1c2124';
g.fillRect(-7, -1.25, 14, 1.05);
g.fillStyle = '#ffe7b5';
for (let x = -6.6; x < 6.6; x += 0.62) g.fillRect(x, -1.0, 0.4, 0.32);
g.fillStyle = '#2a2f33';
g.fillRect(-0.12, -1.25, 0.24, 1.05);
g.fillStyle = '#fff6dc';
g.beginPath();
g.arc(7.0, -0.5, 0.14, 0, Math.PI * 2);
g.fill();
e.light(7.0, -0.5, 0.6, '#fff1cc', 1.4, 'head');
