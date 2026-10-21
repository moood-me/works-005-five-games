// The roll of banknotes in Fogg's hand while he bargains for Kiouni (`banknotes` 1): Bank of England notes, white with
// their black script, rolled and banded in gold — a layer its animate carries to his right hand and makes as thick as
// the offer.
e.layer('roll', { box: [-0.22, -0.16, 0.22, 0.16] }, g => {
  g.fillStyle = '#f6f2e6';
  g.fillRect(-0.19, -0.08, 0.38, 0.16);
  g.fillStyle = 'rgba(30,26,22,0.6)';
  for (let k = 0; k < 5; k++) g.fillRect(-0.17, -0.065 + 0.03 * k, 0.34, 0.008);
  g.fillStyle = '#d8b050';
  g.fillRect(-0.035, -0.09, 0.07, 0.18);
});
