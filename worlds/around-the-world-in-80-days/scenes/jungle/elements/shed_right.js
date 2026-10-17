// The shed's right gable: the thatch's end under the ridge, from eave to eave.
const S = e.lib.plan.shed;
const drop = ((S.ridge - S.posts) * S.eaves) / S.d;
g.fillStyle = '#7a6844';
g.beginPath();
g.moveTo(-S.d - S.eaves, 0);
g.lineTo(0, -(S.ridge - S.posts + drop));
g.lineTo(S.d + S.eaves, 0);
g.closePath();
g.fill();
