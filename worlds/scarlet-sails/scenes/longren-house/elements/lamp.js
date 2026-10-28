const N = e.kit.sky;
const FLAME = 0.22;

// The oil lamp on the bench: a brass foot, a glass chimney — cold, and warm with the flame in it (its animate brings
// the warm glass in as `lamp` says; the flame is the `flame` element)
g.fillStyle = "#504636";
g.beginPath();
g.moveTo(-0.07, 0);
g.lineTo(0.07, 0);
g.lineTo(0.04, -0.045);
g.lineTo(-0.04, -0.045);
g.fill();
g.fillRect(-0.055, -0.095, 0.11, 0.05);
const chimney = (colour) => (g) => {
  g.fillStyle = N.rgba(colour, 0.5);
  g.beginPath();
  g.ellipse(0, -FLAME + 0.02, 0.045, 0.07, 0, 0, 7);
  g.fill();
  g.fillRect(-0.022, -FLAME - 0.16, 0.044, 0.12);
};
e.layer("cold", {}, chimney("#b0b6b8"));
e.layer("warm", {}, chimney(N.mix("#b0b6b8", "#fff2dc", 0.8)));
