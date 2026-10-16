// how far the mist has gone off the sea (sea.glsl), and where the sun stands (the road of glints under it)
e.uniform('front', e.lib.front(e.state.reveal == null ? 1 : +e.state.reveal || 0));
e.uniform('sun_x', e.lib.sunX(e.aspect));
e.uniform('horizon', e.lib.HORIZON);
