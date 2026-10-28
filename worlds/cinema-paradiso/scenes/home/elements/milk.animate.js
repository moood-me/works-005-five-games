if (e.state.era === 'now' || !e.state.table_set) return;
// the milk rising in the glass as it is poured
e.layer('milk').scaleY = Math.max(0.001, Math.min(1, e.state.milk || 0));
