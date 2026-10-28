// London's fog at this hour (`day`): its colours high up and low over the street, for the shader
const light = e.kit.light, A = light.london(e.state.day), m = e.mem;
const h = light.lin(A.high, (m.high ??= [0, 0, 0])), l = light.lin(A.low, (m.low ??= [0, 0, 0]));
e.uniform('high_r', h[0]); e.uniform('high_g', h[1]); e.uniform('high_b', h[2]);
e.uniform('low_r', l[0]); e.uniform('low_g', l[1]); e.uniform('low_b', l[2]);
