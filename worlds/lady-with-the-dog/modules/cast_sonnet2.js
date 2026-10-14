// The world's cast: its data (the motions put in it) plus the shapes of its own.
return {
  ...data,
  shapes: {
    parts: {
      stick: { name: 'палка', draw: F => {
        const V = MooodShapes.V, h = F.P('RightHand');
        const b = V.add(h, [0, -0.95 * F.fit.h, 0]);
        F.bar(h, b, 0.014 * F.k, 0.012 * F.k, [F.colors.accent, F.colors.accent], 6, 'stick');
      } },
    },
  },
};
