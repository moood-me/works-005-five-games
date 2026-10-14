const k = (e.state.bell || 0) * (Math.sin(e.t * 5.6) > 0 ? 1 : 0);
e.glow('a', k);
e.glow('b', (e.state.bell || 0) * (1 - k) );
