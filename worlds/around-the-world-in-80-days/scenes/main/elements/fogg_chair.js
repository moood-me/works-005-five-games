// Fogg's chair behind the whist table, facing us: it stands on the table (its place along it: `chair_back`, the metres it
// is pushed back as he gets up) — the seat at his seat, its back behind him.
const [ta, td] = [e.lib.plan.table.across, e.lib.plan.table.d], [a, d] = e.lib.plan.seats.far;
e.lib.chair(e, [a - ta, d - td], 1);
