// Subsurface Scattering Vertex Shader
// World-space coordinates for consistent lighting
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;

void main() {
  // Transform normal to world space
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  
  // World position
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vUv = uv;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
