const f = e.state.freight || 0;
const lamp = e.state.freight_lamp || 0;
e.glow('far', lamp * (1 - Math.min(1, Math.max(0, (f - 0.05) / 0.12))));
