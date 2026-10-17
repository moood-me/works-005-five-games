// The tall stool at the bench, seen from the room: its two front legs and the rails between them, the seat's
// edge on top. Its back legs and its seat are elements of their own on it (`stool_back`, `stool_top`):
// whoever sits on it sits on the seat (the scene's SEAT — its middle, 0.6 m up: a stool for the bench).
g.fillStyle = "#6f6c67";
for (const lx of [-0.16, 0.13]) g.fillRect(lx, -0.58, 0.03, 0.58);
g.fillStyle = "#64615c";
g.fillRect(-0.15, -0.2, 0.3, 0.02);
g.fillStyle = "#8b8883";
g.fillRect(-0.18, -0.6, 0.36, 0.035);
e.at(0, -0.6, "stool");
