// the spliced strip hanging from his hands to the floor at the window (strip_end): a dark ribbon, its frames catching
// the window's light, curling on the floor
if (!e.state.hanging) return;
g.strokeStyle = '#2a211b'; g.lineWidth = 0.035; g.lineCap = 'round';
g.beginPath(); g.moveTo(0, -1.2); g.bezierCurveTo(0.03, -0.8, -0.04, -0.4, 0.02, -0.06); g.quadraticCurveTo(0.08, 0.0, 0.18, -0.02); g.stroke();
g.fillStyle = 'rgba(230,200,150,0.5)'; for (let i = 0; i < 10; i++) g.fillRect(-0.012 + Math.sin(i) * 0.012, -1.15 + i * 0.11, 0.024, 0.04);
