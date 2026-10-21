// the pin comes up out of the drawhead as it is pulled, tipping over at the end; its top is the game's point `pin`
const u = e.anim.clamp(e.state.uncouple ?? 0, 0, 1), pin = e.layer('pin');
pin.y = -0.55 * u;
pin.rotate = 2.5 * Math.max(0, u - 0.8);
e.at(-0.12, -1.5 + pin.y, 'pin');
