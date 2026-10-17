// The "Tankadere"'s sails (Hong Kong only), thin (they glow against the low sun): each gaff sail furled along its boom
// (a layer) and set — between the boom, the mast and the gaff, her number on the mainsail — a layer its animate raises
// from the boom as `sail` says (the gaff going up the mast with it); the jib from the bowsprit's end to the foremast,
// raised with them.
const L = e.lib;
if (L.portOf(e.state) === 'hongkong') {
  const B = L.plan.boat;
  [[B.masts[0], 7.6, 'main'], [B.masts[1], 5.6, 'fore']].forEach(([[x, top], boom, name]) => {
    // furled: a roll along the boom
    e.layer(`${name}_furled`, {}, g => {
      g.fillStyle = '#d6cfbd';
      g.beginPath();
      g.moveTo(x - 0.1, -1.2);
      g.lineTo(x - 0.1, -1.5);
      g.lineTo(x - boom * 0.8, -1.5);
      g.lineTo(x - boom, -1.0);
      g.quadraticCurveTo(x - boom / 2, -0.75, x - 0.1, -1.2);
      g.fill();
    });
    // set: up to its gaff (raised about the boom: the animate's scaleY)
    const head = 1.4 + (top - B.deck - 3);
    e.layer(name, { pivot: [x, -1.2] }, g => {
      g.strokeStyle = '#4a3e32';
      g.lineWidth = 0.1;
      g.beginPath();
      g.moveTo(x - 0.1, -head);
      g.lineTo(x - boom * 0.8, -head - 1.8);
      g.stroke();
      g.fillStyle = '#efe8d8';
      g.beginPath();
      g.moveTo(x - 0.1, -1.2);
      g.lineTo(x - 0.1, -head - 0.1);
      g.lineTo(x - boom * 0.8, -head - 1.8 - 0.1);
      g.lineTo(x - boom, -1.0);
      g.quadraticCurveTo(x - boom / 2, -0.45, x - 0.1, -1.2);
      g.fill();
      if (name === 'main') {
        g.fillStyle = '#2a2a2a';
        g.font = '1.4px serif';
        g.textAlign = 'center';
        g.fillText('43', x - 3.4, -1.4 - (top - B.deck - 3) * 0.55);
      }
    });
  });
  const [fx, ft] = B.masts[1];
  e.layer('jib', { pivot: [12.2, -1.05] }, g => {
    g.fillStyle = '#efe8d8';
    g.beginPath();
    g.moveTo(12.2, -1.05);
    g.lineTo(fx - 0.1, -1.4 - (ft - B.deck - 3));
    g.lineTo(fx + 0.3, -1.3);
    g.closePath();
    g.fill();
  });
}
