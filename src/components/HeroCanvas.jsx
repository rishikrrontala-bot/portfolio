import { Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useReducedMotion } from '../lib/hooks';

/* ── Shader ──────────────────────────────────────────────────────────────── */

const vertex = /* glsl */ `
  uniform float uTime;
  uniform float uAmp;
  uniform vec2  uMouse;
  varying vec3  vNormalW;
  varying vec3  vViewDir;
  varying float vNoise;

  // Ashima simplex noise (3D) — compact, no texture lookups.
  vec3 mod289(vec3 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 mod289(vec4 x){return x-floor(x*(1.0/289.0))*289.0;}
  vec4 permute(vec4 x){return mod289(((x*34.0)+1.0)*x);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0) * 2.0 + 1.0;
    vec4 s1 = floor(b1) * 2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw * sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw * sh.zzww;
    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x; p1 *= norm.y; p2 *= norm.z; p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  // Displacement field, sampled more than once so the normal can be rebuilt
  // from the surface that actually exists rather than the original sphere.
  float disp(vec3 p, float t) {
    float n  = snoise(p * 0.62 + vec3(t, t * 0.7, -t));
    float n2 = snoise(p * 1.75 + vec3(-t * 1.4, t, t * 0.5)) * 0.24;
    float m  = snoise(p * 1.05 + vec3(uMouse * 1.5, t)) * 0.24;
    return (n + n2 + m) * uAmp;
  }

  void main() {
    float t = uTime * 0.16;

    vNoise = snoise(position * 0.62 + vec3(t, t * 0.7, -t));

    vec3 pos = position + normal * disp(position, t);

    // Rebuild the normal by finite difference — without this the lighting keeps
    // describing a smooth sphere and the displacement reads as a flat gradient.
    vec3 up = abs(normal.y) < 0.99 ? vec3(0.0, 1.0, 0.0) : vec3(1.0, 0.0, 0.0);
    vec3 tangent = normalize(cross(up, normal));
    vec3 bitan = normalize(cross(normal, tangent));
    float e = 0.045;
    vec3 a = position + tangent * e;
    vec3 b = position + bitan * e;
    a += normalize(a) * disp(a, t);
    b += normalize(b) * disp(b, t);
    vec3 n = normalize(cross(a - pos, b - pos));
    if (dot(n, normal) < 0.0) n = -n;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vNormalW = normalize(normalMatrix * n);
    vViewDir = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragment = /* glsl */ `
  uniform vec3  uInk;
  uniform vec3  uTerra;
  uniform vec3  uBone;
  varying vec3  vNormalW;
  varying vec3  vViewDir;
  varying float vNoise;

  void main() {
    vec3 N = normalize(vNormalW);
    float fres = pow(1.0 - max(dot(N, normalize(vViewDir)), 0.0), 2.1);
    float key  = max(dot(N, normalize(vec3(0.45, 0.85, 0.55))), 0.0);
    float fill = max(dot(N, normalize(vec3(-0.7, -0.2, 0.4))), 0.0);

    // Matte clay: broad diffuse falloff, a soft highlight, and a darkened
    // contour at grazing angles so the silhouette separates from the bone page.
    vec3 clay = mix(uInk, uTerra, smoothstep(-1.0, 0.95, vNoise));
    vec3 base = clay * (0.5 + key * 0.7);
    base += uTerra * fill * 0.12;                          // warm bounce
    base = mix(base, uBone * 0.94, pow(key, 2.6) * 0.34);  // desaturated sheen
    base = mix(base, uInk * 0.7, fres * 0.44);             // contour edge

    // Dither so the gradient does not band on wide flat areas.
    float dither = fract(sin(dot(gl_FragCoord.xy, vec2(12.9898, 78.233))) * 43758.5453);
    base += (dither - 0.5) * 0.018;

    gl_FragColor = vec4(base, 1.0);
  }
`;

/* ── Mesh ────────────────────────────────────────────────────────────────── */

function Blob({ reduced }) {
  const mesh = useRef(null);
  const mat = useRef(null);
  const { viewport } = useThree();
  const mouse = useRef(new THREE.Vector2(0, 0));
  const target = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: 0.0 },
      uMouse: { value: new THREE.Vector2(0, 0) },
      uInk: { value: new THREE.Color('#3A1C12') },
      uTerra: { value: new THREE.Color('#CB5C33') },
      uBone: { value: new THREE.Color('#F4F1EA') },
    }),
    [],
  );

  useEffect(() => {
    const on = (e) => {
      target.current.set(
        (e.clientX / window.innerWidth) * 2 - 1,
        -((e.clientY / window.innerHeight) * 2 - 1),
      );
    };
    window.addEventListener('pointermove', on, { passive: true });
    return () => window.removeEventListener('pointermove', on);
  }, []);

  useFrame((state, delta) => {
    // Read the uniforms off the live material, not the object handed to the
    // JSX prop — the renderer does not necessarily keep the same reference,
    // and mutating the prop object silently does nothing.
    const u = mat.current?.uniforms;
    if (!u) return;
    u.uTime.value += reduced ? 0 : delta;
    // Ease the amplitude in so the sphere "inflates" on entry.
    // Ease the amplitude in so the object inflates on entry rather than popping.
    u.uAmp.value += (0.34 - u.uAmp.value) * Math.min(1, delta * 0.9);
    mouse.current.lerp(target.current, 0.045);
    u.uMouse.value.copy(mouse.current);
    if (mesh.current) {
      mesh.current.rotation.y += reduced ? 0 : delta * 0.09;
      mesh.current.rotation.x = mouse.current.y * 0.16;
      mesh.current.position.x = mouse.current.x * 0.12;
    }
  });

  const scale = Math.min(1.55, Math.max(0.86, viewport.width / 5.2));

  return (
    <mesh ref={mesh} scale={scale}>
      <icosahedronGeometry args={[1.35, 48]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vertex}
        fragmentShader={fragment}
        uniforms={uniforms}
        flatShading={false}
      />
    </mesh>
  );
}

/* ── Wrapper ─────────────────────────────────────────────────────────────── */

function supportsWebGL() {
  try {
    const c = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (c.getContext('webgl2') || c.getContext('webgl')));
  } catch {
    return false;
  }
}

/** Static poster used for reduced-motion and no-WebGL. Pure CSS, no request. */
function Fallback() {
  return (
    <div
      aria-hidden="true"
      className="h-full w-full rounded-full"
      style={{
        background:
          'radial-gradient(58% 58% at 38% 32%, #E8703F 0%, #DA532C 34%, #7C2E15 66%, #171512 100%)',
        filter: 'saturate(1.05)',
      }}
    />
  );
}

export default function HeroCanvas({ active = true }) {
  const reduced = useReducedMotion();
  const [ok] = useState(supportsWebGL);

  if (!ok || reduced) {
    return (
      <div className="grid h-full w-full place-items-center p-[8%]">
        <Fallback />
      </div>
    );
  }

  return (
    <Canvas
      className="!absolute inset-0"
      dpr={[1, 2]}
      frameloop={active ? 'always' : 'demand'}
      gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
      camera={{ position: [0, 0, 4.2], fov: 42 }}
    >
      <Suspense fallback={null}>
        <Blob reduced={reduced} />
      </Suspense>
    </Canvas>
  );
}
