// The spanker's gaff, aloft on the mizzen (x 0 at the mast, aft negative; y up from the poop deck)
if (e.lib.shipOf(e.state) === "secret") {
  g.strokeStyle = e.lib.colours(e.state).spar;
  g.lineCap = "round";
  g.lineWidth = 0.15;
  g.beginPath();
  g.moveTo(0.1, -12.6);
  g.lineTo(-6, -14.3);
  g.stroke();
}
