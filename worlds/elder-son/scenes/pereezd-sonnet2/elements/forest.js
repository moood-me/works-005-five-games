// тёмная кромка леса, к которой уходит дуга; ёлки — треугольники разной высоты
g.fillStyle = '#0b1424';
g.fillRect(-240, -4, 480, 6);
let x = -240;
while (x < 240) {
  const w = 3 + e.rnd() * 5, h = 10 + e.rnd() * 20 + (Math.sin(x * 0.03) + 1) * 3;
  g.beginPath(); g.moveTo(x, -3); g.lineTo(x + w / 2, -3 - h); g.lineTo(x + w, -3); g.closePath(); g.fill();
  x += w * (0.45 + e.rnd() * 0.4);
}
// снег на нижних лапах: чуть светлее, чтобы кромка не была чёрной стеной
g.fillStyle = 'rgba(120,150,190,0.14)'; g.fillRect(-240, -9, 480, 6);
