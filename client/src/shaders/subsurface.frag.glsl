// Subsurface Scattering Fragment Shader
// All calculations in world space
varying vec3 vWorldNormal;
varying vec3 vWorldPosition;
varying vec2 vUv;

uniform vec3 baseColor;
uniform vec3 subsurfaceColor;
uniform float subsurfaceIntensity;
uniform float thickness;
uniform vec3 lightPosition;
uniform vec3 viewPosition;
uniform float distortion;
uniform float power;
uniform float scale;

void main() {
  vec3 normal = normalize(vWorldNormal);
  vec3 viewDir = normalize(viewPosition - vWorldPosition);
  vec3 lightDir = normalize(lightPosition - vWorldPosition);
  
  // Calculate light passing through the surface
  vec3 scatterDir = lightDir + normal * distortion;
  float backlight = max(0.0, dot(viewDir, -scatterDir));
  float subsurface = pow(backlight, power) * scale;
  
  // Thickness-based attenuation
  float attenuation = exp(-thickness * (1.0 - subsurface));
  
  // Subsurface scattering contribution
  vec3 subsurfaceContribution = subsurfaceColor * subsurface * attenuation * subsurfaceIntensity;
  
  // Diffuse lighting
  float diffuse = max(0.0, dot(normal, lightDir));
  vec3 diffuseColor = baseColor * diffuse;
  
  // Combine diffuse and subsurface
  vec3 finalColor = diffuseColor + subsurfaceContribution;
  
  // Add ambient
  finalColor += baseColor * 0.2;
  
  gl_FragColor = vec4(finalColor, 1.0);
}
