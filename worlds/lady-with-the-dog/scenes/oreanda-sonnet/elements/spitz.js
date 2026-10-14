const k = e.kit.shpic;
const view = e.state.spitz_view;
e.layer('body', { pivot: [0, 0] }, g => k.body(g, view));
e.layer('leash', { pivot: [0, 0] }, g => k.leash(g, view, e.state.leash));
e.at(view === 'back' ? 0 : -0.25, view === 'back' ? -0.3 : -0.28);
e.at(view === 'back' ? -0.04 : -0.17, view === 'back' ? -0.24 : -0.2, 'collar');
e.at(0, -0.18, 'back');
