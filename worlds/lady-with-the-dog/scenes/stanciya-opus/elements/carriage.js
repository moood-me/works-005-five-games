// Anna's carriage, the last of the train (metres, origin at the middle of its foot, on the rail): its side with her
// window open to the lit compartment behind it. Points: glass (the pane's middle, where her hand lies), sill (the
// frame under it), curtain (the curtain's free edge — marked each frame by animate as it moves).
const L = e.lib;
L.carriage(g, { hole: L.HER_WIN });
// the window's frame round the opening, a little proud
g.strokeStyle = '#3f4842'; g.lineWidth = 0.06;
g.strokeRect(L.HER_WIN - L.WIN.w / 2 - 0.03, L.WIN.y0 - 0.03, L.WIN.w + 0.06, L.WIN.y1 - L.WIN.y0 + 0.06);
e.at(L.HER_WIN, (L.WIN.y0 + L.WIN.y1) / 2, 'glass');
e.at(L.HER_WIN + 0.32, L.WIN.y1 - 0.03, 'sill');
