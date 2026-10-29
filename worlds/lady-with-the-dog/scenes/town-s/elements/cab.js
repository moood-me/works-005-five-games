// The cab waiting on the road: a horse under a blanket, its head to the right, and in winter a sledge, in the thaw a
// droshky; shown while `cab` is 1. The horse's breath steams (particles at its nostrils).
const spring = Number(e.state.spring) > 0.5;
e.layer('all', {}, c => {
  if (spring) {                                                       // the droshky behind the horse
    c.strokeStyle = '#2a2624'; c.lineWidth = 0.05;
    for (const x of [-1.6, -0.5]) { c.beginPath(); c.arc(x, -0.45, 0.45, 0, Math.PI * 2); c.stroke(); }
    c.fillStyle = '#3a3430'; c.fillRect(-2.0, -1.2, 1.6, 0.35); c.fillRect(-1.9, -1.6, 0.25, 0.45);
  } else {                                                            // the sledge
    c.fillStyle = '#3e3832'; c.fillRect(-2.1, -0.9, 1.7, 0.5);
    c.fillRect(-2.0, -1.35, 0.3, 0.5);
    c.strokeStyle = '#2a2624'; c.lineWidth = 0.05; c.beginPath(); c.moveTo(-2.2, -0.08); c.lineTo(-0.3, -0.08); c.quadraticCurveTo(-0.1, -0.1, -0.05, -0.35); c.stroke();
  }
  c.strokeStyle = '#3a3430'; c.lineWidth = 0.04; c.beginPath(); c.moveTo(-0.4, -0.9); c.lineTo(0.5, -1.1); c.stroke();   // the shaft
  c.fillStyle = '#4a3a30';                                            // the horse
  c.beginPath(); c.ellipse(0.55, -1.15, 0.75, 0.38, 0, 0, Math.PI * 2); c.fill();
  for (const x of [0.0, 0.2, 0.9, 1.1]) c.fillRect(x - 0.05, -1.0, 0.1, 1.0);
  c.beginPath(); c.moveTo(1.1, -1.35); c.lineTo(1.45, -1.85); c.lineTo(1.65, -1.75); c.lineTo(1.35, -1.2); c.fill();
  c.beginPath(); c.ellipse(1.6, -1.72, 0.22, 0.11, 0.5, 0, Math.PI * 2); c.fill();
  c.fillStyle = '#5c6470'; c.fillRect(0.0, -1.5, 1.05, 0.55);        // the blanket over its back
  c.strokeStyle = '#2a2420'; c.lineWidth = 0.03; c.beginPath(); c.moveTo(1.2, -1.6); c.quadraticCurveTo(1.0, -2.0, 0.8, -1.9); c.stroke();   // the shaft-bow
  e.at(1.78, -1.66, 'nose');
});
