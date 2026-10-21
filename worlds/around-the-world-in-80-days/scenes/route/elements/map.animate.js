// how far the red line has come (`route`, the game moves it), and the day won (`dateline`)
e.uniform('cut', e.anim.clamp(e.state.route ?? 0, 0, 1));
e.uniform('dateline', e.anim.clamp(e.state.dateline ?? 0, 0, 1));
