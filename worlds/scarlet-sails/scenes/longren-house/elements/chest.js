// The sea chest's front: a long box of dark wood under a lid with a lip, iron bands over both, the
// lock. Its end and its lid are elements of their own on it (`chest_end`, `chest_lid`); its `place`
// is the scene script's: in its corner (chest 0) or pulled out into the room (chest 1). `chest_here` 0: it is not in the
// house at all (Longren has taken it to sea) — nothing of it is painted, nor its end and its lid.
if (!(e.state.chest_here > 0.5)) return;
g.fillStyle = "#534f4a";
g.fillRect(-0.5, -0.46, 1, 0.46);
g.fillStyle = "#605b55";
g.fillRect(-0.52, -0.56, 1.04, 0.1);
g.fillStyle = "#282523";
for (const bx of [-0.36, 0.33]) g.fillRect(bx, -0.56, 0.035, 0.56);
g.fillRect(-0.04, -0.44, 0.08, 0.1);
e.at(0, -0.56, "chest");
// (the point it marks itself by, for the game to point at: the middle of its lid)
e.at(0, -0.56);
// where hands take it to pull it out or push it back: its lid's front edge, at each end
e.at(-0.3, -0.56, "grip_l");
e.at(0.3, -0.56, "grip_r");
