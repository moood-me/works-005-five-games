// how far the strip has come into the light and its frames up (film.wgsl), the lamp behind it
const r = e.state.reveal == null ? 1 : +e.state.reveal || 0;
e.uniform('slide', e.lib.slide(r));
e.uniform('develop', e.lib.develop(r));
e.uniform('span', e.aspect + 0.8);
e.uniform('lamp', e.anim.clamp(e.state.lamp == null ? 1 : +e.state.lamp || 0, 0, 1));
