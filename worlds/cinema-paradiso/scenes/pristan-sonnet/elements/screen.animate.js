const s = e.state.screen_up, b = e.state.beam_on, f = e.state.screen_film;
e.layer('cloth').alpha = s;
e.layer('cloth').brightness = 0.1 + 0.9 * b;
e.layer('romance').alpha = s * b * (f === 'romance' ? 1 : 0);
e.layer('white').alpha = s * b * (f === 'white' ? 1 : 0);
e.glow('screen', s * b);
