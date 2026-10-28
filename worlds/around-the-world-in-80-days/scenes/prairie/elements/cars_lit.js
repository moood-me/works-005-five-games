// The cars' windows lit from within (a sheet just before the near side, unlit by the scene's light: it glows): warm
// panes and their light (`lit`), shown as the lamps are (animate).
const L = e.lib;
e.layer('lit', { box: [-48.4, -3.0, 0.2, -1.95] }, g => {
  g.fillStyle = '#ffd890';
  for (let k = 0; k < L.plan.cars.n; k++) for (const wx of L.WINDOWS) g.fillRect(L.carX(k) + wx + 0.04, -2.91, 0.58, 0.87);
});
e.light(-24.4, -2.45, 0.6, '#ffcc8a', 0.8, 'lit');
