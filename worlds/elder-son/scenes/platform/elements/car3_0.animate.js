// the doors slide by `doors`; frost on the glass at dawn by the play's `frost` (painted only from outside: its layers too)
const S = e.state;
if (S.camera_on !== 'train') {
  e.kit.trains.doorsLive(e, S.doors);
  e.kit.trains.frostLive(e, (Number(S.frost) || 0) * (Number(S.dawn_k) || 0));
  // the red tail lamps going out in the dark as the train goes off (a glow does not fade in the haze by itself)
  const far = Math.max(0, Math.min(1, ((Number(S.train) || 0) - 0.45) / 0.35));
  e.glow('tail', 1 - far);
  e.glow('tail_top', 1 - far);
}
