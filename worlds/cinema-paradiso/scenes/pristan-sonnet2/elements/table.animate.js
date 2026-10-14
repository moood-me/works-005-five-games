const c = e.state.cover;
e.layer('cover').alpha = c > 0.02 ? 1 : 0;
e.layer('cover').y = (1 - c) * -0.6;
