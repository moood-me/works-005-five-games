// The home projector's thin beam from its lens to the square on the partition (cinema.beam; the world's shader).
const B = e.lib.G.BEAM, H = e.lib.G.SCREEN_H;
e.kit.cinema.beam(e, { len: B.len, top: -H / 2, bot: H / 2, mouth: 0.012, dust: 90, drift: 0.25, tipRadius: 0.9, tipStrength: 0.5 });
