// her ports and her side light lit as the lanterns are; the gangway there while she lies alongside
const lit = e.lib.clamp01(e.state.lanterns);
e.layer('lit').alpha = lit;
e.glow('ports', lit);
e.glow('side', lit);
e.layer('gangway').alpha = (e.state.carnatic_present ?? 1) > 0.97 ? 1 : 0;
