// hung under the rail, or down on the water — as `skiff_down` says
e.layer("boat").y = -e.lib.SKIFF_HUNG * (1 - e.anim.clamp(e.state.skiff_down ?? 0, 0, 1));
