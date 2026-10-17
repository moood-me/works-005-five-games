// The mainmast's shrouds just aft of it (x to starboard, y up from the main deck): from the chains
// at the bulwarks up to the hounds, the ratlines across them — the ladder up the mast; the top at
// the crosstrees, the topmast shrouds over it ("Anselm"'s lower and plainer)
const s = e.state;
const c = e.lib.colours(s);
const tall = s.ship === "secret";
const hounds = tall ? -10.6 : -9.6;
g.strokeStyle = c.rig;
g.lineWidth = 0.045;
for (const k of [-1, 1]) {
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    g.moveTo(k * (3.7 + 0.18 * i), -1.1);
    g.lineTo(k * (0.3 + 0.03 * i), hounds);
    g.stroke();
  }
  g.lineWidth = 0.022;
  for (let y = -1.6; y > hounds + 0.8; y -= 0.42) {
    const u = (y + 1.1) / (hounds + 1.1);
    g.beginPath();
    g.moveTo(k * (3.7 + 0.54 * (1 - u) - 3.4 * u), y);
    g.lineTo(k * (4.24 * (1 - u) + 0.39 * u - 0.06 * (1 - u)), y);
    g.stroke();
  }
  g.lineWidth = 0.045;
  if (tall) {
    g.beginPath();
    g.moveTo(k * 2.1, -11.5);
    g.lineTo(k * 0.22, -18);
    g.stroke();
  }
}
g.fillStyle = c.spar;
g.fillRect(-2.2, hounds - 0.85, 4.4, 0.16);
e.at(2.4, -4, "shrouds");
// where a hand takes the starboard shrouds from the deck (a man under them, facing forward)
e.at(3.4, -2, "hold_l");
e.at(3.8, -1.9, "hold_r");
e.at(0, hounds - 0.9, "top");
