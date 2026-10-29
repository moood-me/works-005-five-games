// The painted audience of row 3 (the people's seats in it left empty), seen from the stage: faces (the card faces the stage; painted mirrored). Two layers: those who stay in the interval and those who go out.
e.layer('stay', {}, g2 => e.lib.crowdRow(g2, 3, true, 0));
e.layer('go', {}, g2 => e.lib.crowdRow(g2, 3, true, 1));
