// The steamer from Feodosia, side on, bow to the right; far out on the sea (its place: steamer_a, steamer_d).
// Metres, origin at the waterline amidships. Its three lights are its own glows; animate puts them out one by one.
const hull = '#3d4152', white = '#e7e5dd', funnel = '#2f2f35';
g.fillStyle = hull;
g.beginPath();
g.moveTo(-31, -6); g.lineTo(31, -6); g.lineTo(35, -7.5); g.lineTo(31, 0); g.lineTo(-29, 0); g.lineTo(-32, -3); g.closePath(); g.fill();
g.fillStyle = white;
g.fillRect(-30, -6.2, 61, 2.6);                // the white strake
g.fillRect(-15, -10.5, 26, 4.4);               // the deck house
g.fillRect(-9, -13, 12, 2.6);                  // the bridge
g.fillStyle = '#9da0ab';
for (let x = -13; x < 10; x += 2.2) g.fillRect(x, -9.3, 0.9, 1.1);   // its windows
g.fillStyle = funnel;
g.fillRect(-3, -19, 4.2, 8.5);                  // the funnel
g.fillStyle = '#cfcbbf'; g.fillRect(-3, -15.6, 4.2, 1);
g.strokeStyle = '#4a4a52'; g.lineWidth = 0.45;
g.beginPath(); g.moveTo(-21, -6); g.lineTo(-21, -24); g.moveTo(19, -6); g.lineTo(19, -22);
g.moveTo(-21, -24); g.lineTo(-31, -6); g.moveTo(-21, -24); g.lineTo(19, -22); g.lineTo(34, -7.4); g.stroke();
// the lights: a masthead light, the deck's lamps, the stern's
e.light(-21, -23.5, 30, '#ffd9a0', 1.6, 'l1');
e.light(0, -9.8, 30, '#ffcf92', 1.6, 'l2');
e.light(19, -21.5, 30, '#ffd9a0', 1.6, 'l3');
e.at(0, -14, 'lights');
