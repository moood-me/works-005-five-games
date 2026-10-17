// A tulle curtain at the balcony door, half drawn: thin, the night and the moon come through it; it stirs (metres,
// origin at its foot's middle).
e.layer('tulle', { pivot: [0, -2.6], wind: { strength: 0.35, gust: 0.6, scale: 2 } }, gc => {
  gc.fillStyle = 'rgba(238,236,240,0.55)';
  gc.beginPath(); gc.moveTo(-0.4, -2.6); gc.lineTo(0.4, -2.6); gc.bezierCurveTo(0.42, -1.6, 0.36, -0.8, 0.42, 0); gc.lineTo(-0.38, 0); gc.bezierCurveTo(-0.42, -0.9, -0.36, -1.7, -0.4, -2.6); gc.closePath(); gc.fill();
  gc.fillStyle = 'rgba(255,255,255,0.35)';
  for (let x = -0.34; x < 0.4; x += 0.11) gc.fillRect(x, -2.6, 0.03, 2.6);
});
