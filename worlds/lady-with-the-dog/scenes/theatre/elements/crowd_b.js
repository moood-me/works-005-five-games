// The painted audience of rows 1 and 5…10 (copies, every other one mirrored), seen from behind. Two layers: those who stay in the interval and those who go out.
e.layer('stay', {}, g2 => e.lib.crowdRow(g2, 0, false, 0));
e.layer('go', {}, g2 => e.lib.crowdRow(g2, 0, false, 1));
