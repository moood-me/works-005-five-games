// The hall's screen far below and ahead, seen through the ports: the film (romance; white when the reel ran out or the
// change was late), red curtains at its sides. Lit while the beam is on (animate).
const k = e.kit.kino;
g.fillStyle = '#5a1c20'; g.fillRect(-2.9, -3.5, 0.6, 3.5); g.fillRect(2.3, -3.5, 0.6, 3.5);
k.screen(g, e, { x: -2.2, y: -3.3, w: 4.4, h: 3.3, frames: ['romance', 'white'], sheet: '#2a2622' });
