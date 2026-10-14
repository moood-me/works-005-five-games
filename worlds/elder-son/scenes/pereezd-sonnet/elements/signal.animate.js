// the two red lamps blink in turn while the bell rings
const bell = e.state.bell ? 1 : 0, on = Math.sin(e.t * 7) > 0;
e.glow('l', bell * (on ? 1 : 0.06));
e.glow('r', bell * (on ? 0.06 : 1));
