const n = e.state.night;
e.layer('night').alpha = n * 0.85;
e.layer('stars').alpha = 0.15 + n * 0.85;
