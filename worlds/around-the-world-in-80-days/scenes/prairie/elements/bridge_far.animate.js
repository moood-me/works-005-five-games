// the far face trembles and falls with the near one
const c = e.anim.clamp, st = e.state;
e.lib.quake(e, c(st.shake ?? 0, 0, 1), c(st.bridge_down ?? 0, 0, 1));
