const L = e.lib, A = e.anim, toys = e.state.toys;
for (let i = 0; i < L.GONE.length; i++) e.layer(L.TOY_LAYERS[i]).alpha = 1 - A.span(toys, L.GONE[i] - 0.03, L.GONE[i]);
