const s = e.state, on = Math.max(0, Math.min(1, s.beam_on || 0)) * (s.active === 1 ? 1 : 0);
e.uniform('on', on); e.glow('mouth', on);
