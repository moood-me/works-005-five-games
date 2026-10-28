// Where the sea begins (the scene's "horizon") and the sun stands on it, in stage heights, as the sky paints them —
// sea.js paints by them, its shader (sea.wgsl) takes them as uniforms
var HORIZON = 0.22;
var sunX = function (A) {
  return A * 0.62;
};
return { HORIZON: HORIZON, sunX: sunX };
