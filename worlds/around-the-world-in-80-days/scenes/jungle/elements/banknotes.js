// The roll of banknotes in Fogg's hand while he bargains for Kiouni (`banknotes` 1): Bank of England notes, white with
// their black script, rolled and banded — a layer its animate carries to his right hand and makes as thick as the offer.
e.layer('roll', { box: [-0.14, -0.1, 0.14, 0.1] }, g => {
  g.fillStyle = '#ece6d8';
  g.fillRect(-0.11, -0.05, 0.22, 0.1);
  g.fillStyle = 'rgba(40,36,30,0.55)';
  for (let k = 0; k < 4; k++) g.fillRect(-0.1, -0.04 + 0.025 * k, 0.2, 0.006);
  g.fillStyle = '#c9b98f';
  g.fillRect(-0.02, -0.055, 0.04, 0.11);
});
