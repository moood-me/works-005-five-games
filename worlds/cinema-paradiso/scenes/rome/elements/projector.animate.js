e.kit.cinema.reelsMove(e, false, e.state.beam_on > 0.5 ? 1 : 0);
e.glow('vents', 0.4 + 0.6 * Math.max(0, Math.min(1, e.state.beam_on || 0)));
