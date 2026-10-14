// далеко — заметный ореол фары; вблизи гаснет, чтобы не заливать кадр
const d = e.state.freight_d || 200, on = e.state.freight_lamp || 0;
e.layer('halo').alpha = on * Math.max(0, Math.min(1, (d - 25) / 80));
