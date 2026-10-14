// the cliff top falls gently toward its edge, then the cliff: the sea 90 m below
const E = lib.edge(across);
return distance < E ? -0.5 * anim.span(distance, 5, E) : -90;
