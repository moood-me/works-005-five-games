// The deckhouse's aft face (the bridge on its roof, the funnel through it): planks, a door, a window, the trim, the
// calendar's place on the left (its own element). A part of the «Henrietta» that burns (layer `all`). Its point
// deckhouse#part.
const L = e.lib, c = L.colours(e.state), H = L.plan.house;
e.layer('all', {}, g => {
  L.planked(g, -H.w / 2, H.w / 2, -H.h, 0, c.house, 0.24);
  L.rect(g, -H.w / 2 - 0.06, -H.h - 0.1, H.w + 0.12, 0.12, c.trim);
  L.rect(g, -H.w / 2, -0.12, H.w, 0.12, L.shade(c.house, 0.3));
  L.door(g, 0.2, 0.8, 1.95, L.shade(c.house, 0.15));
  L.pane(g, 1.4, -1.85, 0.6, 0.6, c.trim);
  // the board the calendar hangs on
  L.rect(g, -1.6, -2.15, 0.8, 1.0, L.shade(c.house, 0.25));
  e.at(-0.2, -1.1, 'part');
});
