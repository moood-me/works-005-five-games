// The coupling at the tender's back, on the line's middle: the tender's drawhead reaching back under the first car's
// platform and the pin through it, which holds the link from the first car (the link is the cars' — the chain's). The
// pin is a layer that comes up and out as it is pulled (uncouple); its top is the point `pin` (animate).
const { R } = e.lib;
R(g, -0.34, -1.08, 0.1, -0.72, '#2a2622');
R(g, 0.0, -1.25, 0.16, -0.6, '#2a2622');
e.layer('pin', { pivot: [-0.12, -0.7], box: [-0.3, -1.7, 0.1, -0.55] }, g => {
  R(g, -0.19, -1.45, -0.05, -0.68, '#c4c8ce');
  R(g, -0.26, -1.56, 0.02, -1.43, '#c4c8ce');
});
