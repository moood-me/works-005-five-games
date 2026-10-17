// on the water it rocks a little as it goes; caught in the reeds it stands and rocks more
const here = e.state.toy_water ? 1 : 0;
const stuck = here && e.state.reeds ? 1 : 0;
const toy = e.layer("toy");
toy.alpha = here;
toy.rotate = (0.04 + 0.08 * stuck) * e.anim.noise(e.t * (0.5 + 0.9 * stuck), 3);
e.layer("reeds").alpha = stuck;
