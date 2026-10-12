// the fog's colour at this hour (`day`): London's low fog, warmed a little where the gas is lit
const svet = e.kit.svet, A = svet.london(e.state.day), m = e.mem;
const c = svet.lin(svet.mixc(A.low, '#d8c7a6', 0.12 * A.gas), (m.c ??= [0, 0, 0]));
e.uniform('fog_r', c[0]); e.uniform('fog_g', c[1]); e.uniform('fog_b', c[2]);
