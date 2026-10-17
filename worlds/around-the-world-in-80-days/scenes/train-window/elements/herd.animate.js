// how far the herd has gone (metres: from its head at the card's left edge to its tail past the right), for its shader
const H = e.lib.HERD, k = e.anim.clamp(e.state.herd ?? 0, 0, 1);
e.uniform('gone', k * (H.long + 2 * H.half));
e.uniform('crossing', k > 0 && k < 1 ? 1 : 0);
