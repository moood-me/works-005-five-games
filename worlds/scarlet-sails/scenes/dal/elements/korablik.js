// Assol's toy yacht on the water at the foot of the frame, white hull and two scarlet sails — the thing of the sky the
// player presses to sail on: it marks its point `sail` itself (korablik#sail), in the middle of its sails. Painted
// once; it rocks, and its halo breathes, as its animate moves the layers (`korablik` its brightness).
var A = e.aspect;
var N = e.kit.nebo;
var X = A / 2;
var BASE = 0.95;
var H = 0.11;

// the ripples round its hull
e.layer("wake", {}, function (c) {
  c.strokeStyle = "rgba(255, 255, 255, 0.55)";
  c.lineCap = "round";
  for (var i = 0; i < 3; i++) {
    c.lineWidth = 0.0025 - 0.0006 * i;
    c.beginPath();
    c.ellipse(X, BASE + 0.004, 0.09 + 0.045 * i, 0.007 + 0.004 * i, 0, 0, 6.283);
    c.stroke();
  }
});
// the light round it
e.layer("halo", { blend: "add" }, function (c) {
  N.glow(c, X, BASE - 0.5 * H, 0.16, 1, "#ffe9c2", 0.55);
});
// the yacht (the toy of the world's korabli, in the frame's heights)
e.layer("boat", { pivot: [X, BASE] }, function (c) {
  c.fillStyle = "#f1eee6";
  c.beginPath();
  c.moveTo(X - 0.043, BASE - 0.015);
  c.lineTo(X + 0.043, BASE - 0.017);
  c.quadraticCurveTo(X + 0.032, BASE, X - 0.026, BASE);
  c.closePath();
  c.fill();
  c.strokeStyle = N.rgba("#14233f", 0.5);
  c.lineWidth = 0.0013;
  c.stroke();
  c.fillStyle = "#5d5a55";
  c.fillRect(X - 0.0012, BASE - H, 0.0024, H - 0.015);
  c.fillStyle = N.SCARLET;
  c.beginPath();
  c.moveTo(X - 0.004, BASE - 0.104);
  c.lineTo(X - 0.004, BASE - 0.026);
  c.lineTo(X - 0.04, BASE - 0.026);
  c.closePath();
  c.fill();
  c.beginPath();
  c.moveTo(X + 0.004, BASE - 0.094);
  c.lineTo(X + 0.004, BASE - 0.028);
  c.lineTo(X + 0.04, BASE - 0.028);
  c.closePath();
  c.fill();
  e.at(X, BASE - 0.5 * H, "sail");
});
