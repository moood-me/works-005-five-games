// «Джунгли»'s own little film, outside games: first the jungle by day — along the trail from the end of the rails (the
// train, its steam, the station's board) into the forest —; then every beat of lib.js FILM in its order: dusk and the
// drums, the procession at night, the pyre at dawn, the raja rising from the smoke, his walk to the trees.
const L = scene.lib;
const day = {
  name: 'day',
  run: async s => {
    s.cut({ ...L.START(), day: 0.9, dawn: 0, camera_x: -48, camera_z: 0, camera_h: 0, cromarty_here: false, fogg_here: false, passepartout_here: false, guide_here: false });
    // (the dusk the drums begin in, made ready meanwhile: cut to whole)
    const dusk = s.shot(L.START());
    await s.wait(2);
    await s.move('camera_x', -6, { over: 22, ease: 'inOut' });
    await s.wait(1.5);
    dusk.cut();
  },
};
return [day, ...scene.kit.beats.showcase(scene, L.FILM, L.SHOWCASE)];
