// The candles' flames: each painted at its fullest over its wick (layer `flames`) — how tall it burns, how it flickers
// and leans is the shader's (candles.glsl, by `candles`); each is a light of its own (`left`, `right`: the scene's
// `candle_left`, `candle_right`, on by `candles`) on the table, the walls, the faces at it.
const FH = 0.05, TOP = -0.47;
e.layer("flames", {}, (c) => {
  for (const x of [-0.12, 0.12]) {
    const fg = c.createRadialGradient(x, TOP - FH * 0.35, 0, x, TOP - FH * 0.35, FH);
    fg.addColorStop(0, "rgba(255,246,222,1)");
    fg.addColorStop(0.5, "rgba(255,196,110,0.9)");
    fg.addColorStop(1, "rgba(255,140,60,0)");
    c.fillStyle = fg;
    c.beginPath();
    c.moveTo(x, TOP - FH);
    c.quadraticCurveTo(x + 0.014, TOP - FH * 0.25, x, TOP + 0.002);
    c.quadraticCurveTo(x - 0.014, TOP - FH * 0.25, x, TOP - FH);
    c.fill();
  }
});
e.light(-0.12, -0.5, 0.25, e.kit.sky.WARM, 0.7, "left");
e.light(0.12, -0.5, 0.25, e.kit.sky.WARM, 0.7, "right");
e.at(0, -0.5, "candles");
