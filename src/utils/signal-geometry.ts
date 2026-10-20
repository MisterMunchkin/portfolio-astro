// Original parametric artwork: one continuous surface, explored in three forms.
// The same geometry produces the server-rendered SVG and interactive canvas.
export type SignalMode = "mobile" | "systems" | "agents";
type Vec = [number, number, number];
export type SurfaceFace = { vertices: Vec[]; normal: Vec; center: Vec };
export type DrawFace = { points: number[][]; depth: number; fill: string };

const add = (a: Vec, b: Vec): Vec => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const sub = (a: Vec, b: Vec): Vec => [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
const mul = (a: Vec, s: number): Vec => [a[0] * s, a[1] * s, a[2] * s];
const unit = (a: Vec): Vec => mul(a, 1 / (Math.hypot(...a) || 1));
const cross = (a: Vec, b: Vec): Vec => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];

function curve(t: number, mode: SignalMode): Vec {
  if (mode === "mobile")
    return [
      1.65 * Math.cos(t) + 0.2 * Math.cos(3 * t),
      2.12 * Math.sin(t) - 0.22 * Math.sin(3 * t),
      0.45 * Math.sin(2 * t),
    ];
  if (mode === "agents")
    return [2.1 * Math.cos(t), 1.75 * Math.sin(t), 0.85 * Math.sin(3 * t)];
  const r = 1.65 + 0.65 * Math.cos(3 * t);
  return [r * Math.cos(2 * t), r * Math.sin(2 * t), 0.75 * Math.sin(3 * t)];
}

export function createSignal(
  mode: SignalMode,
  segments = 120,
  sides = 12,
): SurfaceFace[] {
  const ring = (t: number, a: number): { point: Vec; normal: Vec } => {
    const c = curve(t, mode);
    const tangent = unit(sub(curve(t + 0.001, mode), curve(t - 0.001, mode)));
    const n = unit(cross(tangent, [0, 0, 1]));
    const b = unit(cross(tangent, n));
    const normal = add(mul(n, Math.cos(a)), mul(b, Math.sin(a)));
    return {
      point: add(c, mul(normal, mode === "systems" ? 0.34 : 0.39)),
      normal,
    };
  };
  const result: SurfaceFace[] = [];
  for (let i = 0; i < segments; i++) {
    const t = (i * Math.PI * 2) / segments,
      nextT = ((i + 1) * Math.PI * 2) / segments;
    for (let j = 0; j < sides; j++) {
      const a = (j * Math.PI * 2) / sides,
        nextA = ((j + 1) * Math.PI * 2) / sides;
      const points = [
        ring(t, a).point,
        ring(nextT, a).point,
        ring(nextT, nextA).point,
        ring(t, nextA).point,
      ];
      const normal = ring((t + nextT) / 2, (a + nextA) / 2).normal;
      const center = mul(
        points.reduce((sum, p) => add(sum, p), [0, 0, 0] as Vec),
        0.25,
      );
      result.push({ vertices: points, normal, center });
    }
  }
  return result;
}

export function projectSignal(
  mesh: SurfaceFace[],
  width: number,
  height: number,
  yaw = -0.55,
  pitch = 0.48,
): DrawFace[] {
  const rotate = ([x, y, z]: Vec): Vec => {
    const a = x * Math.cos(yaw) + z * Math.sin(yaw);
    const b = -x * Math.sin(yaw) + z * Math.cos(yaw);
    const c = y * Math.cos(pitch) - b * Math.sin(pitch);
    const d = y * Math.sin(pitch) + b * Math.cos(pitch);
    const roll = -0.18;
    return [
      a * Math.cos(roll) - c * Math.sin(roll),
      a * Math.sin(roll) + c * Math.cos(roll),
      d,
    ];
  };
  const scale = Math.min(width, height) / 5.85;
  const light = unit([-0.5, 0.8, 1]);
  const faces: DrawFace[] = [];
  for (const face of mesh) {
    const normal = rotate(face.normal);
    if (normal[2] < -0.12) continue;
    const shade =
      0.32 +
      0.67 *
        Math.max(
          0,
          normal[0] * light[0] + normal[1] * light[1] + normal[2] * light[2],
        );
    const rgb = [211, 255, 82].map((v) => Math.round(v * shade));
    faces.push({
      points: face.vertices.map((p) => {
        const [x, y, z] = rotate(p);
        const perspective = 1 / (1 - z * 0.035);
        return [
          width / 2 + x * scale * perspective,
          height / 2 - y * scale * perspective,
        ];
      }),
      depth: rotate(face.center)[2],
      fill: `rgb(${rgb.join(",")})`,
    });
  }
  return faces.sort((a, b) => a.depth - b.depth);
}
