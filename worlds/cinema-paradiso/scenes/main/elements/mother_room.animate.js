const k = Math.max(0, Math.min(1, e.state.mother_light ?? 0)); e.layer('lit').alpha = k; e.glow('lamp', k);
