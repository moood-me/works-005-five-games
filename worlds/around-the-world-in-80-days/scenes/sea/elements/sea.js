// The sea round the boat, one plane kilometres wide: grey-green, darker toward the horizon; a weak, rough mirror; its
// swells running at the boat and its foam are the shader's (sea.wgsl: `phase` from the animate, `storm`).
const L = e.lib;
const gr = g.createLinearGradient(0, -1500, 0, 1500);
gr.addColorStop(0, L.css(L.mixc(L.C.sea, '#1e2c30', 0.35)));
gr.addColorStop(0.7, L.C.sea);
gr.addColorStop(1, L.css(L.mixc(L.C.sea, '#7a9a96', 0.25)));
g.fillStyle = gr;
g.fillRect(-3000, -1500, 6000, 3000);
