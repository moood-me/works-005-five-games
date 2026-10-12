// the hour (`day`): the fog's colours high up and low over the street, and the gas lit — the windows across with it
const svet = e.kit.svet, A = svet.london(e.state.day), m = e.mem;
const h = svet.lin(A.high, (m.high ??= [0, 0, 0])), l = svet.lin(A.low, (m.low ??= [0, 0, 0]));
e.uniform('high_r', h[0]); e.uniform('high_g', h[1]); e.uniform('high_b', h[2]);
e.uniform('low_r', l[0]); e.uniform('low_g', l[1]); e.uniform('low_b', l[2]);
e.uniform('gas', A.gas);
