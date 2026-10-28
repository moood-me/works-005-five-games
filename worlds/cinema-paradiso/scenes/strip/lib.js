// The projector's lamp: low right in the stage's middle 4:3, in stage heights, as the sky paints it (dark.js, lamp.js)
function lampAt(A) {
  return { x: A / 2 + 2 / 3 - 0.16, y: 0.86 };
}
return { lampAt: lampAt };
