
if (e.state.era !== 'ruin') return;
e.layer('whole').alpha = Math.max(0, Math.min(1, e.state.past));
