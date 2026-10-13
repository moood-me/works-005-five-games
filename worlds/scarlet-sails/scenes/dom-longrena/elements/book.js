// Assol's book fallen on the floor, open, its pages up (`book_down`: there or not) — seen from above.
e.at(0, 0, "book");
if (!(e.state.book_down > 0.5)) return;
g.rotate(0.35);
g.fillStyle = "#5f4c3d";
g.fillRect(-0.16, -0.11, 0.32, 0.22);
g.fillStyle = "#ece6d9";
g.fillRect(-0.15, -0.1, 0.145, 0.2);
g.fillRect(0.005, -0.1, 0.145, 0.2);
g.fillStyle = "rgba(90,80,70,0.35)";
for (let i = 0; i < 6; i++) { g.fillRect(-0.13, -0.07 + i * 0.028, 0.11, 0.006); g.fillRect(0.025, -0.07 + i * 0.028, 0.11, 0.006); }
