// A low grey stone at the water's edge, flat-topped (Assol sits on it at night: its top 0.38 m up), seen
// from the shore: a rounded mass, lighter on top, wet and darker toward the sand.
const top = g.createLinearGradient(0, -0.4, 0, 0);
top.addColorStop(0, "#a9adb2");
top.addColorStop(1, "#6c727a");
g.fillStyle = top;
g.beginPath();
g.moveTo(-0.42, 0);
g.quadraticCurveTo(-0.46, -0.3, -0.24, -0.37);
g.quadraticCurveTo(0.02, -0.41, 0.26, -0.37);
g.quadraticCurveTo(0.47, -0.3, 0.44, 0);
g.closePath();
g.fill();
g.fillStyle = "rgba(60,66,74,0.35)";
g.fillRect(-0.44, -0.05, 0.88, 0.05);
e.at(0, -0.38, "stone");
