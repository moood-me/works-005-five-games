// The time on the clock: the hour and minute hands from `minute` (and the second gone), the second hand stepping on each
// whole second as an escapement lets it, the pendulum swinging with `second` — at the end of its swing on each whole
// second (cos π·second); its bob a point that moves ("clock#pendulum").
const minute = +e.state.minute || 0, second = +e.state.second || 0, tick = Math.floor(second);
const turn = Math.PI * 2, m = minute + tick / 60;
e.layer('hour').rotate = ((m / 720) % 1) * turn;
e.layer('minute').rotate = ((m / 60) % 1) * turn;
e.layer('second').rotate = (tick / 60) * turn;
const a = 0.042 * Math.cos(Math.PI * second);
e.layer('pendulum').rotate = -a;
e.at(2.15 * Math.sin(a), -4.55 + 2.15 * Math.cos(a), 'pendulum');
