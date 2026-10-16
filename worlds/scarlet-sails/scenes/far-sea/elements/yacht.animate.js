// the yacht rocking on the swell, brighter or dimmer by `yacht`, its halo breathing
const k = e.anim.clamp(e.state.yacht == null ? 1 : +e.state.yacht || 0, 0, 1);
const boat = e.layer('boat');
boat.rotate = 0.03 * e.anim.noise(e.t * 0.5, 3);
boat.y = 0.002 * e.anim.noise(e.t * 0.7, 8);
boat.brightness = 0.4 + 0.6 * k;
e.layer('halo').alpha = k * (0.7 + 0.3 * Math.sin(e.t * 1.8));
