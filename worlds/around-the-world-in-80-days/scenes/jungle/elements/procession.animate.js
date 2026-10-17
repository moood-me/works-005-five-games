// the column's head: over the first torch-bearer's head, while the column is here
if (e.state.pb1_here) {
  const p = e.point('pb1#head');
  if (p) e.at(p[0], p[1] - 0.6, 'procession');
}
