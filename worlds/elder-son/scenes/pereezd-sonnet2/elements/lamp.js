// фонарь переезда: столб, вылет, колпак; свет — один тёплый источник у людей
g.fillStyle = '#1b222f';
g.fillRect(-0.09, -5.1, 0.18, 5.1);                       // столб
g.fillRect(-0.16, -0.5, 0.32, 0.5);                       // основание
g.beginPath(); g.moveTo(-0.07, -5.1); g.quadraticCurveTo(0.05, -5.5, 0.9, -5.4); g.lineTo(0.9, -5.28); g.quadraticCurveTo(0.2, -5.34, 0.07, -4.95); g.closePath(); g.fill();
g.fillStyle = '#273044';
g.beginPath(); g.moveTo(0.55, -5.4); g.lineTo(1.3, -5.4); g.lineTo(1.15, -5.22); g.lineTo(0.7, -5.22); g.closePath(); g.fill();
g.fillStyle = '#e8963a'; g.fillRect(0.74, -5.2, 0.38, 0.1);
g.fillStyle = '#dbe4f2'; g.fillRect(0.55, -5.46, 0.75, 0.08);   // снег на колпаке
e.light(0.93, -5.1, 0.9, '#e8963a', 1.6, 'lamp');
e.at(0.93, -5.1, 'lamp');
