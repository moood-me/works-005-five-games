// The baker's window lit from within: loaves on the shelves in warm light (`lamps` fades it; its light — `shop`)
e.layer('lit', {}, gl => {
  gl.fillStyle = '#f2c88c';
  gl.fillRect(-1.75, -2.55, 2.5, 2.0);
  gl.fillStyle = 'rgba(150,100,50,0.5)';
  for (const y of [-2.1, -1.5, -0.9]) {
    gl.fillRect(-1.7, y, 2.4, 0.05);
    for (let x = -1.6; x < 0.6; x += 0.32) {
      gl.beginPath();
      gl.ellipse(x + 0.12, y - 0.1, 0.13, 0.08, 0, 0, Math.PI * 2);
      gl.fill();
    }
  }
  gl.strokeStyle = 'rgba(60,50,40,0.7)';
  gl.lineWidth = 0.05;
  gl.beginPath();
  gl.moveTo(-0.5, -2.6);
  gl.lineTo(-0.5, -0.5);
  gl.stroke();
});
e.light(-0.5, -1.5, 0.5, '#ffcf90', 0.6, 'window');
