const st = e.state.spitz_do === 'stand';
const here = e.state.spitz_here ? 1 : 0;
e.layer('lie').alpha = st ? 0 : here; e.layer('stand').alpha = st ? here : 0;
