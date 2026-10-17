// The neighbours' passage behind their door, a dim bulb (seen only with the door open). Metres.
const gr = g.createRadialGradient(0, -1.9, 0.1, 0, -1.3, 1.5);
gr.addColorStop(0, '#c99a60');
gr.addColorStop(0.7, '#7e5634');
gr.addColorStop(1, '#3e2a1c');
g.fillStyle = gr;
g.fillRect(-1.0, -2.4, 2.0, 2.42);
g.fillStyle = '#4a4440';
g.fillRect(-0.6, -0.42, 0.3, 0.42);
