// The painted audience of row 3 (the people's seats in it left empty), seen from behind. Two layers: those who stay in the interval and those who go out.
e.layer('stay', {}, g2 => e.lib.crowdRow(g2, 3, false, 0));
e.layer('go', {}, g2 => e.lib.crowdRow(g2, 3, false, 1));
