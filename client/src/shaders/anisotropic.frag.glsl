// Anisotropic Specular Fragment Shader
// All calculations in world space
varying vec3 vWorldNormal;
varying vec3 vWorldTangent;
varying vec3 vWorldBitangent;
varying vec3 vWorldPosition;
varying vec2 vUv;

uniform vec3 baseColor;
uniform vec3 specularColor;
uniform float roughnessX;
uniform float roughnessY;
uniform float specularIntensity;
uniform vec3 lightPosition;
uniform vec3 viewPosition;
uniform float anisotropicRotation;

// Anisotropic GGX distribution with NaN protection
float anisotropicGGX(float ndoth, float hdotx, float hdoty, float ax, float ay) {
  float a2 = ax * ay;
  vec3 v = vec3(ay * hdotx, ax * hdoty, a2 * ndoth);
  float v2 = dot(v, v);
  
  // Protect against division by zero
  if (v2 < 0.0001) {
    return 0.0;
  }
  
  float w2 = a2 / v2;
  return a2 * w2 * w2 / 3.14159265359;
}

void main() {
  vec3 normal = normalize(vWorldNormal);
  vec3 tangent = normalize(vWorldTangent);
  vec3 bitangent = normalize(vWorldBitangent);
  
  // Additional NaN check
  if (any(isnan(tangent)) || any(isnan(bitangent))) {
    gl_FragColor = vec4(baseColor * 0.5, 1.0);
    return;
  }
  
  // Rotate tangent frame for anisotropic direction
  float rotation = anisotropicRotation * 3.14159265359;
  vec3 rotatedTangent = tangent * cos(rotation) + bitangent * sin(rotation);
  vec3 rotatedBitangent = cross(normal, rotatedTangent);
  
  // All vectors in world space
  vec3 viewDir = normalize(viewPosition - vWorldPosition);
  vec3 lightDir = normalize(lightPosition - vWorldPosition);
  vec3 halfDir = normalize(lightDir + viewDir);
  
  // Anisotropic specular calculation
  float ndoth = max(0.0, dot(normal, halfDir));
  float hdotx = dot(halfDir, rotatedTangent);
  float hdoty = dot(halfDir, rotatedBitangent);
  
  // Roughness values (lower = sharper highlight)
  float ax = max(0.001, roughnessX * roughnessX);
  float ay = max(0.001, roughnessY * roughnessY);
  
  float specular = anisotropicGGX(ndoth, hdotx, hdoty, ax, ay);
  
  // Clamp specular to prevent fireflies
  specular = min(specular, 10.0);
  
  vec3 specularContribution = specularColor * specular * specularIntensity;
  
  // Diffuse component
  float ndotl = max(0.0, dot(normal, lightDir));
  vec3 diffuseColor = baseColor * ndotl;
  
  // Combine with ambient
  vec3 finalColor = diffuseColor + specularContribution + baseColor * 0.15;
  
  // Clamp to prevent out-of-range colors
  finalColor = clamp(finalColor, 0.0, 1.5);
  
  gl_FragColor = vec4(finalColor, 1.0);
}
