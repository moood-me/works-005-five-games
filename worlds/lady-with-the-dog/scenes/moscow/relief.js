// The land: flat but for the two porches — the Gurovs' steps rising from the pavement (across 1.95) to the porch's top
// (0.75) at 2.8…3.6, distance 11.9…14.1; the club's from the road (−4.0) to its portico (0.6) at −4.7…−5.4, distance
// 21.8…25.2 (lib.js PORCH, CLUB_PORCH — the same numbers). Behind the fronts (across ≥ 3.6, ≤ −5.4) it is flat again:
// the floors inside are planes.
return 0.75 * anim.span(across, 1.95, 2.8) * (1 - anim.span(across, 3.58, 3.6)) * anim.span(distance, 11.85, 11.95) * (1 - anim.span(distance, 14.05, 14.15))
  + 0.6 * anim.span(across, -4.0, -4.7) * (1 - anim.span(across, -5.38, -5.4)) * anim.span(distance, 21.75, 21.85) * (1 - anim.span(distance, 25.15, 25.25));
