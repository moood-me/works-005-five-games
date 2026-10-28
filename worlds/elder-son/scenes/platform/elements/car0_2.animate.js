// the doors slide by `doors`; frost on the glass at dawn by the play's `frost` (painted only from outside: its layers too)
const S = e.state;
if (S.camera_on !== 'train') {
  e.kit.trains.doorsLive(e, S.doors);
  e.kit.trains.frostLive(e, (Number(S.frost) || 0) * (Number(S.dawn_k) || 0));
}
