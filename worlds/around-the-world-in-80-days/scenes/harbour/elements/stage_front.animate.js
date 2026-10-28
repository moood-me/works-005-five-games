// the footlights lit as the lanterns are (their light is the scene's ramp, lit by `lanterns` itself)
if (e.layer('lit').scaleX) e.layer('lit').alpha = e.lib.clamp01(e.state.lanterns);
