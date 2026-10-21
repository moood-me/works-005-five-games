// the trestle trembles (shake); its middle span drops and turns into the gorge (bridge_down)
const c = e.anim.clamp, st = e.state;
e.lib.quake(e, c(st.shake ?? 0, 0, 1), c(st.bridge_down ?? 0, 0, 1));
