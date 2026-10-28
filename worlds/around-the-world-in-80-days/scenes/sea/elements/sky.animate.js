// the storm's slate and scud as far as it is come; the gleam as it dies away (only after the height: storm below 0.4)
const s = e.lib.clamp01(e.state.storm);
e.layer('slate').alpha = e.anim.ease.smooth(e.anim.span(s, 0.05, 0.75));
e.layer('scud').alpha = e.anim.span(s, 0.15, 0.6);
e.layer('cloud').alpha = 1 - 0.6 * e.anim.span(s, 0.3, 0.8);
e.layer('gleam').alpha = e.lib.clamp01(e.state.steamer) * (1 - e.anim.span(s, 0.2, 0.5));
