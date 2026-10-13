// Lisse's quay, its face of dressed stone toward the ship lying alongside (x along it, + back toward her stern; its
// top 1.2 m under her poop deck): courses of stone, paler at the top, dark and wet at the water, the fender beam, iron
// bollards
const face = g.createLinearGradient(0, -3.8, 0, 0);
face.addColorStop(0, "#a29e96");
face.addColorStop(0.55, "#86827b");
face.addColorStop(1, "#4d4c4a");
g.fillStyle = face;
g.fillRect(-70, -3.8, 140, 3.8);
g.fillStyle = "rgba(40,38,36,0.22)";
for (let y = -3.4; y < 0; y += 0.55) g.fillRect(-70, y, 140, 0.03);
for (let y = -3.8, k = 0; y < 0; y += 0.55, k++) for (let x = -70 + (k % 2) * 0.7; x < 70; x += 1.4) g.fillRect(x, y, 0.03, 0.55);
g.fillStyle = "#cfcbc2";
g.fillRect(-70, -3.8, 140, 0.12);
g.fillStyle = "#5a4c3e";
g.fillRect(-70, -3.4, 140, 0.25);
g.fillStyle = "#3a3936";
for (let x = -66; x < 70; x += 12) {
  g.fillRect(x - 0.18, -4.3, 0.36, 0.5);
  g.fillRect(x - 0.26, -4.4, 0.52, 0.12);
}
e.at(0, -3.8, "quay");
