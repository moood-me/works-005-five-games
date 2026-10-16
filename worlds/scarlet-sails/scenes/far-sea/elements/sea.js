// the sea at dawn to the horizon, the sky over it: a low sun on the water's edge and its road of light, long soft
// clouds, the water in streaks that grow longer toward the viewer. Painted once, in the colours of the hour; the
// mist that hides it, the glints on it and the sun's road twinkling are its shader's (sea.glsl).
var A = e.aspect;
var N = e.kit.sky;
var HZ = e.lib.HORIZON;
var SX = e.lib.sunX(A);
var X0 = -0.3;
var X1 = A + 0.3;
var Y0 = -0.35;
var Y1 = 1.25;

// the sky: lilac-blue above, rose and gold down to the water
var sky = g.createLinearGradient(0, Y0, 0, HZ);
sky.addColorStop(0, "#a9b8d9");
sky.addColorStop(0.5, "#cdc9dc");
sky.addColorStop(0.82, "#f0d4c6");
sky.addColorStop(1, "#fae3c3");
g.fillStyle = sky;
g.fillRect(X0, Y0, X1 - X0, HZ - Y0);
// long soft clouds
for (var i = 0; i < 8; i++) {
  var cloud = i % 2 ? "#fbe7da" : "#d6d4e6";
  N.glow(g, X0 + e.rnd() * (X1 - X0), 0.02 + e.rnd() * 0.17, 0.2 + e.rnd() * 0.25, 0.1, cloud, 0.45);
}
// the sun, just risen
N.glow(g, SX, HZ - 0.012, 0.42, 0.9, "#ffe2ae", 0.55);
g.fillStyle = "#fff4d8";
g.beginPath();
g.arc(SX, HZ - 0.012, 0.026, 0, 6.283);
g.fill();

// the water: warm at the edge of the sky, bluer and deeper toward the viewer (light enough for dark words)
var sea = g.createLinearGradient(0, HZ, 0, Y1);
sea.addColorStop(0, "#f1d9c0");
sea.addColorStop(0.05, "#d9d3cf");
sea.addColorStop(0.22, "#b7c9d6");
sea.addColorStop(0.6, "#9bb8cd");
sea.addColorStop(1, "#86a8c2");
g.fillStyle = sea;
g.fillRect(X0, HZ, X1 - X0, Y1 - HZ);
// the sun's road on it, and the haze along the horizon
N.glow(g, SX, HZ + 0.2, 0.22, 2.6, "#ffe6b8", 0.45);
N.glow(g, A / 2, HZ, 1.3, 0.04, "#fff0dc", 0.5);
// streaks of the swell, longer and thicker the nearer
g.lineCap = "round";
for (var k = 0; k < 260; k++) {
  var u = Math.pow(e.rnd(), 1.7);
  var y = HZ + 0.01 + (Y1 - HZ - 0.01) * u;
  var len = 0.03 + 0.35 * Math.pow(u, 1.2);
  var x = X0 + e.rnd() * (X1 - X0);
  g.strokeStyle = e.rnd() < 0.5 ? N.rgba("#ffffff", 0.05 + 0.1 * e.rnd()) : N.rgba("#5c7fa0", 0.05 + 0.1 * e.rnd());
  g.lineWidth = 0.0012 + 0.0045 * u;
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x + len, y);
  g.stroke();
}
