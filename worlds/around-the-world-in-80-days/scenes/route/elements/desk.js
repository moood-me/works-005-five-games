// the dark walnut of the desk the map is spread on (seen only past the map's edges)
const gr = g.createLinearGradient(0, -0.35, 0, 1.25);
gr.addColorStop(0, '#2c1f16');
gr.addColorStop(1, '#3a291c');
g.fillStyle = gr;
g.fillRect(-0.3, -0.35, e.aspect + 0.6, 1.6);
