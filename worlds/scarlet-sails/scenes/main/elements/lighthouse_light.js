// The lighthouse's light (a light of its own: the night does not darken it): the lamp, and its beam through the mist
// to either side — two layers its animate opens and shuts as the lamp turns
const lamp = -36.4;
const colour = "#fff0d2";
e.layer("lamp", {}, (g) => {
  g.fillStyle = colour;
  g.fillRect(-0.7, lamp - 0.7, 1.4, 1.4);
  e.light(0, lamp, 30, colour, 0.9, "lamp");
});
for (const [name, sign] of [["right", 1], ["left", -1]]) {
  e.layer(name, { box: sign > 0 ? [0, lamp - 6, 260, lamp + 5] : [-260, lamp - 6, 0, lamp + 5], pivot: [0, lamp], blend: "add" }, (g) => {
    const beam = g.createLinearGradient(0, 0, 260 * sign, 0);
    beam.addColorStop(0, "rgba(255,240,210,0.22)");
    beam.addColorStop(1, "rgba(255,240,210,0)");
    g.fillStyle = beam;
    g.beginPath();
    g.moveTo(0, lamp - 0.5);
    g.lineTo(260 * sign, lamp - 6);
    g.lineTo(260 * sign, lamp + 5);
    g.lineTo(0, lamp + 0.5);
    g.fill();
  });
}
