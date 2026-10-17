
// The station's front across the platform: GIANCALDO, its doors and shutters (lib.station); in 1988 one window lit
const now = e.state.era === 'now';
e.lib.station(g, now);
if (now) { g.fillStyle = '#e8b878'; g.fillRect(-4.05, -6.2, 1.1, 1.6); e.light(-3.5, -5.4, 0.8, '#ffcf8a', 0.8, 'window'); }
