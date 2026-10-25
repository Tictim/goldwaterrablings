import * as THREE from 'three'

export const PIDEF = `#define PI 3.1415926535897932`

// inigo quilez, circular smin https://iquilezles.org/articles/smin/
export const SMIN = `
float smin(float a, float b, float k) {
  k *= 1.0 / (1.0 - sqrt(0.5));
  float h = max(k - abs(a - b), 0.0) / k;
  return min(a, b) - k * 0.5 * (1.0 + h - sqrt(1.0 - h * (h - 2.0)));
}`.trim()

/**
 * inigo quilez save us
 * MIT License
 * https://www.shadertoy.com/view/ldl3W8
 * requires smin
 */
export const VORONOI = `
vec2 voronoi_hash2(vec2 p) {
  p = vec2(
    dot(p, vec2(127.1, 311.7)),
    dot(p, vec2(269.5, 183.3))
  );
  return fract(sin(p) * 43758.5453);
}

vec3 voronoi(in vec2 x, in vec2 bounds, float smoothFactor) {
  x *= bounds;
  vec2 n = floor(x);
  vec2 f = fract(x);

  float md = 8.0;
  vec2 mg, mr;

  for (int j = -2; j <= 2; j++) {
    for (int i = -2; i <= 2; i++) {
      vec2 g = vec2(float(i), float(j));
      vec2 o = voronoi_hash2(mod(g + n, bounds)) - f;
      vec2 r = g + o;

      float d = dot(r, r);
      if (d < md) {
        md = d;
        mr = r;
        mg = g;
      }
    }
  }

  md = 8.0;
  for(int j = -2; j <= 2; j++) {
    for(int i = -2; i <= 2; i++) {
      vec2 g = mg + vec2(float(i), float(j));
      vec2 o = voronoi_hash2(mod(g + n, bounds)) - f;
      vec2 r = g + o;

      if (dot(mr - r, mr - r) > 0.00001) {
        md = min(md, dot(0.5 * (mr + r), normalize(r - mr)));
      }
    }
  }

  return vec3(md, mr);
}`.trim()

// w3c soft light
export const SOFTLIGHT = `
float softLight(float a, float b) {
  return b <= 0.5 ?
    a - (1.0 - 2.0 * b) * a * (1.0 - a) :
    a + (2.0 * b - 1.0) * ((a <= 0.25 ?
      ((16.0 * a - 12.0) * a + 4.0) * a :
      sqrt(a)) - a);
}

vec2 softLight(vec2 a, vec2 b) {
  return vec2(softLight(a.x, b.x), softLight(a.y, b.y));
}

vec3 softLight(vec3 a, vec3 b) {
  return vec3(softLight(a.x, b.x), softLight(a.y, b.y), softLight(a.z, b.z));
}

vec4 softLight(vec4 a, vec4 b) {
  return vec4(softLight(a.x, b.x), softLight(a.y, b.y), softLight(a.z, b.z), softLight(a.w, b.w));
}`.trim()

export const C = `
vec3 c(int r, int g, int b) {
  return vec3(float(r) / 255.0, float(g) / 255.0, float(b) / 255.0);
}`.trim()

// https://jcgt.org/published/0009/03/02/
// https://www.shadertoy.com/view/XlGcRh
export const PCG = `
uint seed(uvec2 p) {
    return 19u * p.x + 47u * p.y + 101u;
}

uint pcg(uint v) {
	uint state = v * 747796405u + 2891336453u;
	uint word = ((state >> ((state >> 28u) + 4u)) ^ state) * 277803737u;
	return (word >> 22u) ^ word;
}

uint pcg2(in uvec2 v) {
  return pcg(pcg(v.x) + v.y);
}`.trim()

// https://thebookofshaders.com/11/
// requires pcg
export const PERLIN_NOISE = `
float perlinNoise(in vec2 st, in vec2 bounds) {
  // uvec2 i = uvec2(st);
  vec2 i = st * bounds;
  vec2 f = fract(st);
  i = floor(i);

  uvec4 h = uvec4(
    pcg2(uvec2(mod(i, bounds))),
    pcg2(uvec2(mod(i + vec2(1.0, 0.0), bounds))),
    pcg2(uvec2(mod(i + vec2(0.0, 1.0), bounds))),
    pcg2(uvec2(mod(i + vec2(1.0, 1.0), bounds)))
  );

  vec4 hf = vec4(h) * (1.0 / float(0xffffffffu));
  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(hf.x, hf.y, u.x) +
    (hf.z - hf.x) * u.y * (1.0 - u.x) +
    (hf.w - hf.y) * u.x * u.y;
}
`.trim()

export const DEBUGGING = `#if defined(DEBUG)
  // grid for visual debug
  ivec2 pxCoord = ivec2(gl_FragCoord.xy);
  pxCoord /= 16;
  float step = step(0.5, float((pxCoord.x + pxCoord.y) % 2));
  gl_FragColor = mix(gl_FragColor, vec4(vUv, 1.0, 1.0), step);
  #endif`

/**
 * @param renderer duh
 * @param time animation frame time, miliseconds
 * @param animProgress offset from water texture basis based on anim, in pixels
 */
export type WaterRenderer = (
  renderer: THREE.WebGLRenderer,
  time: number,
  animProgress: number
) => number // additional y-offset to be applied, in pixels

export function fullscreenBlitCamera(): THREE.Camera {
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  camera.position.z = 0.5
  return camera
}

export function fullscreenBlitScene(
  material: THREE.Material,
  geometry?: THREE.BufferGeometry
): THREE.Scene {
  geometry ??= new THREE.PlaneGeometry(2, 2)
  return new THREE.Scene().add(new THREE.Mesh(geometry, material))
}
