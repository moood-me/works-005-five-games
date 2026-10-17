// the coat coming down over the chair's back as it is hung (coat_on_chair 0…1)
const u = e.anim.clamp(+e.state.coat_on_chair || 0, 0, 1), coat = e.layer("coat");
coat.alpha = Math.min(1, u * 3);
coat.y = -0.25 * (1 - e.anim.ease.out(u));
