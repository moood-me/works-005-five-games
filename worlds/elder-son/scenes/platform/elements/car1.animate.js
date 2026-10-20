// the doors slide by `doors`; frost on the glass at dawn by the play's `frost`
const S = e.state;
e.kit.trains.doorsLive(e, S.doors);
e.kit.trains.frostLive(e, (Number(S.frost) || 0) * (Number(S.dawn_k) || 0));
