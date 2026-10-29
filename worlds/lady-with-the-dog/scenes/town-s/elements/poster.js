// The theatre's poster pasted on the fence under the lantern: a printed playbill, “The Geisha”.
g.fillStyle = '#e6dfcc'; g.fillRect(-0.32, -2.02, 0.64, 0.8);
g.fillStyle = 'rgba(120,110,90,0.25)'; g.fillRect(-0.32, -1.3, 0.64, 0.08);
g.fillStyle = '#3a3430';
g.save(); g.scale(0.01, 0.01); g.textAlign = 'center';                 // the type in centimetres
g.font = 'bold 9px serif'; g.fillText(tr('The Geisha'), 0, -180, 58);
g.font = '4px serif'; g.fillText(tr('first time in S.'), 0, -172, 58);
g.restore();
for (let i = 0; i < 6; i++) g.fillRect(-0.24, -1.62 + i * 0.05, 0.48 * (0.5 + e.anim.hash(i, 3) * 0.5), 0.012);
