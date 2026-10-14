const w = 4.6, h = 2.6;
e.layer('cloth', { box: [-w / 2 - 0.1, -h - 0.1, w / 2 + 0.1, 0.1] }, g => {
  g.fillStyle = '#1c1a17'; g.fillRect(-w / 2 - 0.06, -h - 0.06, w + 0.12, h + 0.12);
  g.fillStyle = '#e9e3d2'; g.fillRect(-w / 2, -h, w, h);
});
e.layer('romance', { flicker: 0.12, box: [-w / 2, -h, w / 2, 0] }, g => {
  const bg = g.createLinearGradient(-w / 2, 0, w / 2, -h);
  bg.addColorStop(0, '#9c978c'); bg.addColorStop(0.5, '#d4d0c4'); bg.addColorStop(1, '#8c887e');
  g.fillStyle = bg; g.fillRect(-w / 2, -h, w, h);
  g.fillStyle = '#e8e6dc'; g.beginPath(); g.moveTo(0.5, 0); g.lineTo(0.5, -1.5); g.arc(1.2, -1.5, 0.7, Math.PI, 0); g.lineTo(1.9, 0); g.closePath(); g.fill();
  g.fillStyle = '#2a2a2e';
  g.beginPath(); g.ellipse(1.1, -1.55, 0.2, 0.25, 0, 0, 6.28); g.fill();
  g.fillRect(1.04, -1.34, 0.14, 0.2);
  g.beginPath(); g.moveTo(0.6, 0); g.quadraticCurveTo(0.7, -1.0, 1.1, -1.15); g.quadraticCurveTo(1.6, -1.0, 1.8, 0); g.closePath(); g.fill();
  g.beginPath(); g.arc(1.32, -1.65, 0.16, 0, 6.28); g.fill();
  g.fillStyle = '#16161a';
  g.beginPath(); g.ellipse(-0.35, -1.5, 0.2, 0.25, 0, 0, 6.28); g.fill();
  g.fillRect(-0.4, -1.28, 0.16, 0.2);
  g.beginPath(); g.ellipse(-0.35, -1.68, 0.4, 0.07, 0, 0, 6.28); g.fill();
  g.beginPath(); g.ellipse(-0.35, -1.78, 0.2, 0.14, 0, 0, 6.28); g.fill();
  g.beginPath(); g.moveTo(-1.3, 0); g.quadraticCurveTo(-1.2, -1.05, -0.35, -1.1); g.quadraticCurveTo(0.3, -1.0, 0.4, 0); g.closePath(); g.fill();
  const vg = g.createRadialGradient(0, -h / 2, 0.6, 0, -h / 2, 2.8);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(0,0,0,0.5)');
  g.fillStyle = vg; g.fillRect(-w / 2, -h, w, h);
});
e.layer('white', { box: [-w / 2, -h, w / 2, 0] }, g => { g.fillStyle = '#ffffff'; g.fillRect(-w / 2, -h, w, h); });
e.light(0, -h / 2, 7, '#f6e6c2', 1.2, 'screen');
e.at(0, -h / 2, 'screen');
