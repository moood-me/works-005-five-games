const k = Math.max(0, Math.min(1, e.state.elena_window ?? 0)); e.layer('room').alpha = Math.min(1, k * 1.5); e.glow('room', k);
