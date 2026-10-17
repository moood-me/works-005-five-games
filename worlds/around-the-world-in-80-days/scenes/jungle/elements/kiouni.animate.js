// His points where the near flank has them now (the flank turned to us: walking right the left one)
const f = (((e.state.kiouni_facing ?? 90) % 360) + 360) % 360, side = f > 0 && f < 180 ? 'kiouni_l' : 'kiouni_r';
const eye = e.point(`${side}#eye`), tip = e.point(`${side}#tip`), lift = e.point(`${side}#lift`);
if (eye) { e.at(eye[0], eye[1], 'head'); e.at(eye[0], eye[1]); }
if (tip) e.at(tip[0], tip[1], 'trunk');
if (lift) e.at(lift[0], lift[1], 'lift');
