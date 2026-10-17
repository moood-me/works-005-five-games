// the sails going up as `sail` says: the furled rolls gone, the set sails raised from their booms
if (e.layer('main').scaleX) {
  const up = e.anim.ease.inOut(e.lib.clamp01(e.state.sail));
  for (const n of ['main', 'fore']) {
    e.layer(n).scaleY = Math.max(0.02, up);
    e.layer(n).alpha = up > 0.01 ? 1 : 0;
    e.layer(`${n}_furled`).alpha = 1 - e.anim.ease.smooth(e.anim.span(up, 0, 0.3));
  }
  e.layer('jib').scaleY = Math.max(0.02, up);
  e.layer('jib').alpha = up;
}
