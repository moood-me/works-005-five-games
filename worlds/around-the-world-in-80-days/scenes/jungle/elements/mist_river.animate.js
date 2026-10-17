// the mist as thick as the hour: most at dawn, some at night, little by day
const day = e.anim.clamp(e.state.day ?? 0.85, 0, 1), dawn = e.anim.clamp(e.state.dawn ?? 0, 0, 1);
const k = Math.min(1, 0.12 + 0.4 * (1 - day) + 0.5 * dawn * (1 - 0.5 * day));
e.layer('east').alpha = k;
e.layer('west').alpha = k;
