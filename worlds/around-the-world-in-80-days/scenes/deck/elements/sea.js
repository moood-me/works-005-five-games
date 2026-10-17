// The sea round the ship, one plane kilometres wide: its colour the ship's sea (the Red Sea's and the Indian Ocean's
// blue, the Pacific's, the Atlantic's grey-green), darker toward the horizon; a mirror (the sky, the sun, the moon's
// path); its whitecaps and its running past the hull are the shader's (`speed`: the animate's phase).
const c = e.lib.colours(e.state);
const gr = g.createLinearGradient(0, -2000, 0, 2000);
gr.addColorStop(0, e.lib.rgba(e.lib.mixc(c.sea, '#1a2a38', 0.25)));
gr.addColorStop(0.65, c.sea);
gr.addColorStop(1, e.lib.rgba(e.lib.mixc(c.sea, '#6aa0b0', 0.2)));
g.fillStyle = gr;
g.fillRect(-3000, -2000, 6000, 4000);
