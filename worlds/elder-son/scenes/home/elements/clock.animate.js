// once a second each way, as a wall clock's pendulum goes
e.layer('pendulum').rotate = 0.22 * Math.sin(e.t * Math.PI);
