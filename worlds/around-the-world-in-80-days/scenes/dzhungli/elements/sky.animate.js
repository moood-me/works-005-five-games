// The sky's light as `day` and `dawn` are now: the day's and the dawn's layers mixed in (its shader), the stars and the
// moon as dark as the night is, the sun where the hour has it — low and saffron over the river at dawn, high in the day.
const a = e.anim, day = a.clamp(e.state.day ?? 0.85, 0, 1), dawn = a.clamp(e.state.dawn ?? 0, 0, 1);
const dark = 1 - a.ease.smooth(a.span(day, 0.15, 0.45)), shine = Math.max(dawn, a.span(day, 0.3, 0.7)), k = day * (1 - dawn);
const sun = e.layer('sun');
sun.x = -e.aspect * 0.18 * k;
sun.y = 0.12 * (1 - dawn) - 0.95 * k;
e.uniform('day', day);
e.uniform('dawn', dawn);
e.uniform('dark', dark);
e.uniform('shine', shine);
e.uniform('sunX', sun.x);
e.uniform('sunY', sun.y);
e.glow('moon', dark);
e.glow('sun', shine);
