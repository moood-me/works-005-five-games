// reefed: shorter from the boom up, the reefed cloth bundled on the boom; trembling in the wind as the storm blows
const l = e.layer('sail'), st = e.state;
l.scaleY = 1 - 0.42 * e.lib.clamp01(st.reef);
l.scaleX = 1 + 0.015 * e.lib.clamp01(st.storm) * e.anim.noise(e.t * 5, e.id.length);
e.layer('reefed').alpha = e.lib.clamp01(st.reef);
