const on = Math.max(0, Math.min(1, e.state.beam_on ?? 0));
e.uniform('on', on); e.glow('mouth', on); e.glow('tip', 0);
