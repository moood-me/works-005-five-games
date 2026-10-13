// how much the fire burns now (`fire` 0…1): what glows of it, in the shader
e.uniform("heat", e.anim.clamp(+e.state.fire || 0, 0, 1));
