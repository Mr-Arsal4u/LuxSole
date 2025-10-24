// Iridescent Sheen Fragment Shader
// All calculations in world space
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;

uniform vec3 baseColor;
uniform float iridescentIntensity;
uniform float iridescentScale;
uniform float metalness;
uniform float roughness;
uniform vec3 viewPosition;

// Fresnel effect for iridescence
float fresnel(vec3 viewDir, vec3 normal, float power) {
  return pow(1.0 - max(0.0, dot(viewDir, normal)), power);
}

// HSV to RGB conversion for rainbow colors
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

void main() {
  vec3 normal = normalize(vWorldNormal);
  vec3 viewDir = normalize(viewPosition - vWorldPosition);
  
  // Calculate fresnel for edge glow
  float fresnelValue = fresnel(viewDir, normal, 3.0);
  
  // Create iridescent color shift based on normal and view angle
  float dotProduct = dot(normal, viewDir);
  float hue = fract(dotProduct * iridescentScale + vUv.x * 0.5);
  vec3 iridescentColor = hsv2rgb(vec3(hue, 0.8, 1.0));
  
  // Mix base color with iridescent effect
  vec3 finalColor = mix(baseColor, iridescentColor, fresnelValue * iridescentIntensity);
  
  // Add metallic sheen
  float metallic = metalness * (1.0 - roughness * 0.5);
  finalColor = mix(finalColor, finalColor * 1.5, metallic * fresnelValue);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
