const st = e.state, on = e.lib.clamp01(st.steamer), t = e.lib.clamp01(st.steamer_turn);
e.layer('side').alpha = on * (1 - t);
e.layer('bow').alpha = on * t;
