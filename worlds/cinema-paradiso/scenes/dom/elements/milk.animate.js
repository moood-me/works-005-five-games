// the milk rising in the glass as it is poured
e.layer('milk').scaleY = Math.max(0.001, Math.min(1, e.state.milk || 0));
