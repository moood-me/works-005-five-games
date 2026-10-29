// The painted audience of rows 1 and 5…10 (copies, every other one mirrored), seen from the stage: faces (the card faces the stage; painted mirrored). Two layers: those who stay in the interval and those who go out.
e.layer('stay', {}, g2 => e.lib.crowdRow(g2, 0, true, 0));
e.layer('go', {}, g2 => e.lib.crowdRow(g2, 0, true, 1));
