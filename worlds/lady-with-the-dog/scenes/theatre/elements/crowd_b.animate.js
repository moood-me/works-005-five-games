// the hall filling (crowd) and emptying in the interval (leave): those who go out fade, those who stay remain
const s = e.state, c = e.lib.clamp01(s.crowd), l = e.lib.clamp01(s.leave);
e.layer('stay').alpha = c;
e.layer('go').alpha = c * (1 - l);
