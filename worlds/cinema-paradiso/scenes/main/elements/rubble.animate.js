const c = Math.max(0, Math.min(1, ((e.state.collapse ?? 0) - 0.35) / 0.65)), l = e.layer('heap'); l.alpha = c > 0 ? 1 : 0; l.scaleY = Math.max(0.01, c); l.y = 0;
