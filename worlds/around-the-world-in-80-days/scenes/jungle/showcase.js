// «The jungle»'s own little film, outside games: first the jungle by day — along the trail from the end of the rails (the
// train, its steam, the station's board) into the forest —; then the beats of lib.js film in the order of lib.SHOWCASE:
// the end of the rails and the bargain, Kiouni ridden, dusk and the drums, the procession at night, the pagoda by night,
// the pyre at dawn, the rajah rising from the smoke and his walk to the trees, the flight; the dash through the torches;
// Allahabad, Aouda waking, Kiouni given and sold. The games' beats play themselves here (haggle_show, ride_show,
// walk_show, charge_show).
const L = scene.lib;
const day = {
  name: 'day',
  run: async s => {
    s.cut({ ...L.START(), day: 0.9, dawn: 0, camera_x: -48, camera_z: 0, camera_h: 0, kiouni_x: -34, kiouni_d: 13.4, kiouni_facing: 90,
      cromarty_here: false, fogg_here: false, passepartout_here: false, guide_here: false });
    await s.wait(2);
    await s.move('camera_x', -6, { over: 22, ease: 'inOut' });
    await s.wait(1.5);
  },
};
return [day, ...scene.kit.beats.showcase(scene, L.film(scene), L.SHOWCASE)];
