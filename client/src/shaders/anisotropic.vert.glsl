// Anisotropic Specular Vertex Shader
// Uses world-space coordinates for consistent lighting
varying vec3 vWorldNormal;
varying vec3 vWorldTangent;
varying vec3 vWorldBitangent;
varying vec3 vWorldPosition;
varying vec2 vUv;

// Frisvad method for building robust orthonormal basis
void buildOrthonormalBasis(vec3 n, out vec3 b1, out vec3 b2) {
  if (n.z < -0.9999999) {
    b1 = vec3(0.0, -1.0, 0.0);
    b2 = vec3(-1.0, 0.0, 0.0);
    return;
  }
  float a = 1.0 / (1.0 + n.z);
  float b = -n.x * n.y * a;
  b1 = vec3(1.0 - n.x * n.x * a, b, -n.x);
  b2 = vec3(b, 1.0 - n.y * n.y * a, -n.y);
}

void main() {
  // Transform normal to world space
  vWorldNormal = normalize(mat3(modelMatrix) * normal);
  
  // Build robust orthonormal basis in world space
  buildOrthonormalBasis(vWorldNormal, vWorldTangent, vWorldBitangent);
  
  // World position
  vWorldPosition = (modelMatrix * vec4(position, 1.0)).xyz;
  vUv = uv;
  
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
