// The park under the windows, seen from above (x across, y toward the eye; centre 44 m left, 20 m
// ahead, 1.2 m below the hall's floor): the lawn, paler in its middle, a gravel walk along the house
// and one away from it, the clipped hedge along its far end over the drop to the sea.
g.fillStyle = "#7f8a7c";
g.fillRect(-40, -60, 80, 120);
const lawn = g.createRadialGradient(0, 0, 4, 0, 0, 55);
lawn.addColorStop(0, "rgba(176,184,164,0.35)");
lawn.addColorStop(1, "rgba(176,184,164,0)");
g.fillStyle = lawn;
g.fillRect(-40, -60, 80, 120);
g.fillStyle = "#b9b4a6";
g.fillRect(34, -60, 3.2, 120);
g.fillRect(-40, -12, 74, 2.6);
g.fillStyle = "#56604f";
g.fillRect(-40, -60, 1.6, 120);
