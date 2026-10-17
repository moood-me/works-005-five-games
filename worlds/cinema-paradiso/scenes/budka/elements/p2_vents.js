// the lamp house's vents glowing while projector 2 throws its beam (its light: p2_lamp)
if (e.state.era === 'ruin') return;
e.light(0, -0.62, 0.12, '#ffb860', 0.8, 'vents');
e.at(0, -0.62, 'vents');
