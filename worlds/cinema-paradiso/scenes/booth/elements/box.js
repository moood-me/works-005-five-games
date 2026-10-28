// a low box of film cans (a form 0.44 × 0.3 × 0.36, its anchor at its middle): the boy's seat by the stool
g.fillStyle = '#5a4630'; g.fillRect(-0.74, -0.36, 1.48, 0.36);
g.fillStyle = '#4a3a28'; g.fillRect(-0.74, -0.36, 1.48, 0.04); for (const x of [-0.74, -0.3, 0, 0.44]) g.fillRect(x, -0.36, 0.02, 0.36);
g.save(); g.scale(0.01, 0.01); g.fillStyle = 'rgba(30,24,20,0.55)'; g.font = '700 4px sans-serif'; g.textAlign = 'center'; g.fillText('LUX FILM', -52, -16); g.fillText('LUX FILM', 22, -16); g.restore();
e.form(e.lib.boxForm(0.44, 0.3, 0.36, 0.15), { closed: 'u' });
