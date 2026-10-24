// Original deterministic mango model; shared by the live renderer and static art.
export type Vec3 = [number, number, number];
export type TreeKind =
  | "branch"
  | "leaf"
  | "flush"
  | "flower"
  | "panicle"
  | "fruit"
  | "fruit-stem";
export type TreeFace = {
  vertices: Vec3[];
  normals: Vec3[];
  normal: Vec3;
  kind: TreeKind;
  anchor?: Vec3;
  tone: number;
  phase: number;
  development: number;
  uv: [number, number][];
};
export const treeKinds: TreeKind[] = [
  "branch",
  "leaf",
  "flush",
  "flower",
  "panicle",
  "fruit",
  "fruit-stem",
];
const add = (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
const mul = (a: Vec3, n: number): Vec3 => [a[0] * n, a[1] * n, a[2] * n];
const sub = (a: Vec3, b: Vec3): Vec3 => add(a, mul(b, -1));
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const unit = (a: Vec3): Vec3 => mul(a, 1 / (Math.hypot(...a) || 1));
const dot = (a: Vec3, b: Vec3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
const mix = (a: Vec3, b: Vec3, t: number) => add(mul(a, 1 - t), mul(b, t));
const curve = (p: Vec3[], t: number): Vec3 =>
  add(
    add(mul(p[0], (1 - t) ** 3), mul(p[1], 3 * t * (1 - t) ** 2)),
    add(mul(p[2], 3 * t * t * (1 - t)), mul(p[3], t ** 3)),
  );
const clamp = (n: number) => Math.max(0, Math.min(1, n));
const smooth = (a: number, b: number, n: number) => {
  const t = clamp((n - a) / (b - a));
  return t * t * (3 - 2 * t);
};

export function createTree(detail = 3): TreeFace[] {
  const faces: TreeFace[] = [];
  let seed = 2107,
    phase = 0;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const face = (
    vertices: Vec3[],
    kind: TreeKind = "branch",
    tone = 0,
    anchor?: Vec3,
    normals?: Vec3[],
    development = 0,
    uv?: [number, number][],
  ) => {
    const normal = unit(
      cross(sub(vertices[1], vertices[0]), sub(vertices[2], vertices[0])),
    );
    faces.push({
      vertices,
      normal,
      normals: normals || vertices.map(() => normal),
      kind,
      tone,
      anchor,
      phase,
      development,
      uv: uv || vertices.map(() => [0, 0]),
    });
  };
  const tube = (points: Vec3[], radius: number, taper = 0.64) => {
    const steps =
        radius > 0.08 ? 14 : radius > 0.035 ? 8 : Math.max(3, detail + 1),
      sides = radius > 0.035 ? 12 : 8;
    const rings: Vec3[][] = [],
      normals: Vec3[][] = [];
    for (let i = 0; i <= steps; i++) {
      const t = i / steps,
        center = curve(points, t),
        tangent = unit(
          sub(
            curve(points, Math.min(1, t + 0.005)),
            curve(points, Math.max(0, t - 0.005)),
          ),
        );
      const u = unit(cross(tangent, [0, 0, 1])),
        v = unit(cross(tangent, u));
      // Continuous taper, with a little collar at the base of each bough.
      const r =
        radius *
        (taper + (1 - taper) * (1 - t) ** 1.25) *
        (1 + 0.07 * Math.exp(-t * 12));
      const nr = Array.from({ length: sides }, (_, j) =>
        unit(
          add(
            mul(u, Math.cos((j * 2 * Math.PI) / sides)),
            mul(v, Math.sin((j * 2 * Math.PI) / sides)),
          ),
        ),
      );
      rings.push(nr.map((n) => add(center, mul(n, r))));
      normals.push(nr);
    }
    for (let i = 0; i < steps; i++)
      for (let j = 0; j < sides; j++) {
        const k = (j + 1) % sides;
        face(
          [rings[i][j], rings[i][k], rings[i + 1][k], rings[i + 1][j]],
          "branch",
          j / sides,
          undefined,
          [normals[i][j], normals[i][k], normals[i + 1][k], normals[i + 1][j]],
          i / steps,
        );
      }
    face(rings[steps]);
  };
  const leaf = (
    center: Vec3,
    direction: Vec3,
    size: number,
    fresh: boolean,
  ) => {
    phase = random();
    const tone = random(),
      kind = fresh ? "flush" : "leaf",
      side = unit(cross(direction, [0, 1, 0.2])),
      curl = (random() - 0.5) * 0.24;
    const spine = Array.from({ length: 7 }, (_, i) => {
      const t = i / 6;
      return add(add(center, mul(direction, size * t)), [
        curl * size * t * t,
        -size * t * t * 0.36,
        Math.sin(t * Math.PI) * size * curl,
      ]);
    });
    const widths = spine.map(
      (_, i) =>
        Math.sin((i / 6) * Math.PI) ** 0.75 *
        0.16 *
        size *
        (1 + 0.09 * Math.sin(i * 1.7 + phase * 6)),
    );
    const normals = spine.map((_, i) => {
      let n = unit(
        cross(side, sub(spine[Math.min(6, i + 1)], spine[Math.max(0, i - 1)])),
      );
      if (n[1] < 0) n = mul(n, -1);
      return n;
    });
    for (let i = 0; i < 6; i++)
      for (const sign of [-1, 1]) {
        const a = add(spine[i], mul(side, widths[i] * sign)),
          b = add(spine[i + 1], mul(side, widths[i + 1] * sign));
        const ridgeA = add(
            spine[i],
            mul(normals[i], size * 0.018 * Math.sin((i / 6) * Math.PI)),
          ),
          ridgeB = add(
            spine[i + 1],
            mul(
              normals[i + 1],
              size * 0.018 * Math.sin(((i + 1) / 6) * Math.PI),
            ),
          );
        const na = unit(add(normals[i], mul(side, sign * 0.12))),
          nb = unit(add(normals[i + 1], mul(side, sign * 0.12)));
        face(
          sign === 1 ? [a, b, ridgeB, ridgeA] : [ridgeA, ridgeB, b, a],
          kind,
          tone,
          center,
          sign === 1
            ? [na, nb, normals[i + 1], normals[i]]
            : [normals[i], normals[i + 1], nb, na],
          (i + 0.5) / 6,
          sign === 1
            ? [
                [sign, i / 6],
                [sign, (i + 1) / 6],
                [0, (i + 1) / 6],
                [0, i / 6],
              ]
            : [
                [0, i / 6],
                [0, (i + 1) / 6],
                [sign, (i + 1) / 6],
                [sign, i / 6],
              ],
        );
      }
  };
  const panicle = (base: Vec3, azimuth: number) => {
    phase = random();
    const up: Vec3 = [
        Math.cos(azimuth) * 0.08,
        0.15 + random() * 0.1,
        Math.sin(azimuth) * 0.08,
      ],
      tip = add(base, up),
      count = 9 + Math.floor(random() * 4);
    face(
      [base, add(base, [0.004, 0, 0]), add(tip, [0.003, 0, 0]), tip],
      "panicle",
      0,
      base,
    );
    for (let i = 0; i < count; i++) {
      const t = (i + 0.5) / count,
        angle = i * 2.399 + phase * 2,
        spread = (1 - t) * (0.05 + random() * 0.025),
        joint = add(base, mul(up, t));
      const center = add(joint, [
        Math.cos(angle) * spread,
        -0.012 * (1 - t),
        Math.sin(angle) * spread,
      ]);
      face(
        [
          joint,
          add(joint, [0.0025, 0, 0]),
          add(center, [0.0025, 0, 0]),
          center,
        ],
        "panicle",
        0,
        base,
        undefined,
        t,
      );
      const r = 0.008 + random() * 0.004,
        points = [
          add(center, [r, 0, 0]),
          add(center, [-r, 0, 0]),
          add(center, [0, r, 0.002]),
          add(center, [0, 0, -r]),
        ];
      for (const ids of [
        [0, 1, 2],
        [0, 3, 1],
        [0, 2, 3],
        [1, 3, 2],
      ])
        face(
          ids.map((i) => points[i]),
          "flower",
          random(),
          base,
          ids.map((i) => unit(sub(points[i], center))),
          t,
        );
    }
  };
  const mango = (attachment: Vec3, size: number, angle: number) => {
    phase = random();
    const neck = add(attachment, [0.025, -0.085 - random() * 0.035, 0]),
      tone = random(),
      rings: Vec3[][] = [],
      normals: Vec3[][] = [];
    // Broad unequal shoulders, a flattened cheek and an off-axis small beak.
    for (let i = 0; i <= 10; i++) {
      const t = i / 10,
        r = Math.sin(Math.PI * t) ** 0.65,
        shift = 0.13 * Math.sin(t * Math.PI * 0.9) + 0.045 * t ** 5;
      const ring: Vec3[] = [],
        nr: Vec3[] = [];
      for (let j = 0; j < 14; j++) {
        const a = (j * 2 * Math.PI) / 14,
          x = (Math.cos(a) * r * 0.44 + shift) * size,
          z = Math.sin(a) * r * 0.29 * size,
          y = -size * (t * 1.32);
        ring.push(
          add(neck, [
            x * Math.cos(angle) + z * Math.sin(angle),
            y,
            -x * Math.sin(angle) + z * Math.cos(angle),
          ]),
        );
        const n = unit([
          (Math.cos(a) * r) / 0.44,
          Math.cos(Math.PI * t) / 0.66,
          (Math.sin(a) * r) / 0.29,
        ]);
        nr.push([
          n[0] * Math.cos(angle) + n[2] * Math.sin(angle),
          n[1],
          -n[0] * Math.sin(angle) + n[2] * Math.cos(angle),
        ]);
      }
      rings.push(ring);
      normals.push(nr);
    }
    for (let i = 0; i < 10; i++)
      for (let j = 0; j < 14; j++) {
        const k = (j + 1) % 14;
        face(
          [rings[i][j], rings[i][k], rings[i + 1][k], rings[i + 1][j]],
          "fruit",
          tone,
          neck,
          [normals[i][j], normals[i][k], normals[i + 1][k], normals[i + 1][j]],
          (i + 0.5) / 10,
        );
      }
    face(
      [
        attachment,
        add(attachment, [0.004, 0, 0]),
        add(neck, [0.004, 0, 0]),
        neck,
      ],
      "fruit-stem",
      tone,
      attachment,
    );
  };
  const grow = (
    start: Vec3,
    azimuth: number,
    elevation: number,
    length: number,
    radius: number,
    depth: number,
  ) => {
    const dir: Vec3 = [
      Math.cos(azimuth) * Math.cos(elevation),
      Math.sin(elevation),
      Math.sin(azimuth) * Math.cos(elevation),
    ];
    const end = add(add(start, mul(dir, length)), [
      0,
      depth < 2 ? -length * 0.1 : 0,
      0,
    ]);
    const points = [
      start,
      add(add(start, mul(dir, length * 0.3)), [0, length * 0.08, 0]),
      add(mix(start, end, 0.76), [0, length * 0.1, 0]),
      end,
    ];
    tube(points, radius, depth === 0 ? 0.1 : 0.64);
    if (depth > 0) {
      grow(
        end,
        azimuth - 0.45 - random() * 0.5,
        Math.min(1.2, elevation * 0.7 + 0.08 + random() * 0.32),
        length * (0.65 + random() * 0.1),
        radius * 0.49,
        depth - 1,
      );
      grow(
        curve(points, 0.82),
        azimuth + 0.6 + random() * 0.6,
        0.28 + random() * 0.5,
        length * (0.59 + random() * 0.16),
        radius * 0.42,
        depth - 1,
      );
    }
    if (depth < 2) {
      const count = depth === 0 ? 7 : 4,
        offset = random() * 2;
      for (let i = 0; i < count; i++) {
        const t = 0.48 + i * 0.075,
          angle = azimuth + offset + i * 2.399,
          position = curve(points, Math.min(0.98, t));
        leaf(
          position,
          unit([Math.cos(angle), -0.18 - random() * 0.7, Math.sin(angle)]),
          0.25 + random() * 0.13,
          depth === 0 && i === 0 && random() > 0.2,
        );
      }
    }
    if (depth === 2) {
      for (let i = 0; i < 3; i++) {
        const angle = azimuth + i * 2.2;
        leaf(
          curve(points, 0.65 + i * 0.1),
          unit([Math.cos(angle), -0.4, Math.sin(angle)]),
          0.22 + random() * 0.07,
          false,
        );
      }
    }
    if (depth === 1 && random() > 0.52)
      mango(curve(points, 0.72), 0.2 + random() * 0.045, azimuth);
    if (depth === 0) {
      if (random() > 0.26) panicle(end, azimuth);
      if (random() > 0.91)
        mango(curve(points, 0.8), 0.19 + random() * 0.07, azimuth);
    }
  };
  const trunk: Vec3[] = [
    [-0.06, -1.46, 0],
    [-0.26, -1.03, 0.055],
    [0.14, -0.5, -0.02],
    [0.04, -0.1, 0],
  ];
  tube(trunk, 0.13, 0.44);
  grow(curve(trunk, 0.53), 3.4, 0.34, 0.8, 0.052, 3);
  grow(curve(trunk, 0.7), 0.1, 0.57, 0.91, 0.054, 4);
  grow(curve(trunk, 0.94), 2.3, 0.58, 0.94, 0.049, 4);
  grow(curve(trunk, 0.98), 4.8, 0.77, 0.86, 0.039, 3);
  for (let i = 0; i < 7; i++) {
    const a = (i * 2 * Math.PI) / 7,
      end: Vec3 = [
        Math.cos(a) * (0.28 + random() * 0.13),
        -1.49,
        Math.sin(a) * 0.26,
      ];
    tube(
      [
        trunk[0],
        add(trunk[0], [Math.cos(a) * 0.12, -0.015, Math.sin(a) * 0.12]),
        add(end, [0, 0.018, 0]),
        end,
      ],
      0.042,
      0.03,
    );
  }
  return faces;
}

export function mangoLifecycle(progress: number) {
  const p = clamp(progress);
  return {
    flush: 1 - smooth(0.07, 0.28, p),
    bloom: smooth(0.14, 0.31, p) * (1 - smooth(0.42, 0.57, p)),
    fruit: smooth(0.41, 0.58, p) * (1 - smooth(0.85, 0.99, p)),
    ripe: smooth(0.57, 0.8, p),
    size: 0.18 + 0.82 * smooth(0.43, 0.72, p),
    stage:
      p < 0.22 ? "flush" : p < 0.48 ? "bloom" : p < 0.9 ? "fruit" : "evergreen",
  };
}
export function organLifecycle(
  progress: number,
  phase: number,
  development = 0,
) {
  const envelope = smooth(0, 0.06, progress) * (1 - smooth(0.94, 1, progress));
  return mangoLifecycle(
    progress + ((phase - 0.5) * 0.08 - development * 0.018) * envelope,
  );
}
export function rotateTree(p: Vec3, yaw = -0.38, pitch = 0.07): Vec3 {
  const x = p[0] * Math.cos(yaw) + p[2] * Math.sin(yaw),
    z = -p[0] * Math.sin(yaw) + p[2] * Math.cos(yaw);
  return [
    x,
    p[1] * Math.cos(pitch) - z * Math.sin(pitch),
    p[1] * Math.sin(pitch) + z * Math.cos(pitch),
  ];
}
export function treeBounds(mesh: TreeFace[]) {
  const b = [Infinity, -Infinity, Infinity, -Infinity];
  for (const f of mesh)
    for (const p of f.vertices) {
      const q = rotateTree(p),
        k = 7 / (7 - q[2]),
        x = q[0] * k,
        y = -q[1] * k;
      b[0] = Math.min(b[0], x);
      b[1] = Math.max(b[1], x);
      b[2] = Math.min(b[2], y);
      b[3] = Math.max(b[3], y);
    }
  return {
    cx: (b[0] + b[1]) / 2,
    cy: (b[2] + b[3]) / 2,
    width: b[1] - b[0],
    height: b[3] - b[2],
  };
}
export function treePose(
  p: Vec3,
  anchor: Vec3,
  kind: TreeKind,
  phase: number,
  size: number,
  time = 0,
  wind = 0,
): Vec3 {
  let local = sub(p, anchor);
  if (kind === "fruit") {
    local = [
      local[0] * (0.48 + 0.52 * size),
      local[1] * (0.24 + 0.76 * size),
      local[2] * (0.5 + 0.5 * size),
    ];
    const a = Math.sin(time * 0.65 - phase * 2) * wind * 0.025,
      c = Math.cos(a),
      s = Math.sin(a);
    local = [
      local[0] * c - local[1] * s,
      local[0] * s + local[1] * c,
      local[2],
    ];
  }
  if (kind === "leaf" || kind === "flush") {
    const flutter =
      Math.sin(time * 3.4 + phase * 6) *
      wind *
      0.05 *
      clamp(Math.hypot(...local) / 0.35);
    local[1] += flutter;
    local[2] += flutter * 0.45;
  }
  const q = add(anchor, local),
    weight = Math.max(0, q[1] + 0.7) ** 1.5;
  return add(q, [
    weight *
      0.018 *
      wind *
      (Math.sin(time * 0.8) + 0.24 * Math.sin(time * 1.7 + q[2])),
    0,
    weight * 0.009 * wind * Math.cos(time * 0.75),
  ]);
}
export function treeMaterial(
  face: TreeFace,
  normal: Vec3,
  progress: number,
  depth: number,
) {
  const life = organLifecycle(
      progress,
      face.phase,
      face.kind === "flower" ? face.development : 0,
    ),
    leaf = face.kind === "leaf" || face.kind === "flush",
    n = unit(normal),
    key = unit([-0.65, 1.1, 1.8]);
  const diffuse = leaf ? Math.abs(dot(n, key)) : Math.max(0, dot(n, key)),
    fill = Math.max(0, dot(n, unit([1, 0.5, -0.6])));
  const shine = Math.pow(
      Math.max(0, dot(n, unit([-0.3, 0.9, 2]))),
      leaf ? 28 : 20,
    ),
    shade = 0.27 + diffuse * 0.64 + fill * 0.11;
  let color = [165, 131, 92],
    opacity = 1;
  if (leaf) {
    const green = [
      72 + face.tone * 35,
      119 + face.tone * 37,
      58 + face.tone * 24,
    ];
    color =
      face.kind === "flush"
        ? green.map(
            (v, i) => v * (1 - life.flush) + [165, 82, 62][i] * life.flush,
          )
        : green;
  }
  if (face.kind === "flower") {
    color = [246, 229, 197];
    opacity = life.bloom;
  }
  if (face.kind === "panicle") {
    color = [151, 111, 82];
    opacity = life.bloom;
  }
  if (face.kind === "fruit") {
    const ripe = life.ripe * (0.86 + 0.14 * face.development),
      gold = [234, 173 - face.tone * 33, 53];
    color = [89, 142, 57].map((v, i) => v * (1 - ripe) + gold[i] * ripe);
    opacity = life.fruit;
  }
  if (face.kind === "fruit-stem") {
    color = [123, 118, 62];
    opacity = life.fruit;
  }
  const haze = clamp((0.55 - depth) * 0.13),
    specular = shine * (face.kind === "fruit" ? 0.25 : leaf ? 0.12 : 0.1);
  color = color.map((v, i) =>
    Math.min(
      255,
      (v * shade + [230, 222, 192][i] * specular) * (1 - haze) +
        [17, 23, 16][i] * haze,
    ),
  );
  return { color, opacity, size: life.size };
}
export function projectTree(
  mesh: TreeFace[],
  width: number,
  height: number,
  yaw = -0.38,
  pitch = 0.07,
  progress = 0,
  time = 0,
  wind = 0,
) {
  const b = treeBounds(mesh),
    scale = Math.min((width * 0.92) / b.width, (height * 0.88) / b.height);
  return mesh
    .map((face) => {
      const life = organLifecycle(progress, face.phase),
        vertices = face.vertices.map((p) =>
          rotateTree(
            treePose(
              p,
              face.anchor || [0, 0, 0],
              face.kind,
              face.phase,
              life.size,
              time,
              wind,
            ),
            yaw,
            pitch,
          ),
        ),
        normal = unit(
          face.normals.reduce((a, n) => add(a, rotateTree(n, yaw, pitch)), [
            0, 0, 0,
          ] as Vec3),
        ),
        depth = vertices.reduce((s, p) => s + p[2], 0) / vertices.length,
        material = treeMaterial(face, normal, progress, depth);
      return {
        points: vertices.map((p) => {
          const k = 7 / (7 - p[2]);
          return [
            width * 0.5 + (p[0] * k - b.cx) * scale,
            height * 0.49 + (-p[1] * k - b.cy) * scale,
          ];
        }),
        depth,
        fill: `rgb(${material.color.map(Math.round).join(",")})`,
        opacity: material.opacity,
      };
    })
    .sort((a, b) => a.depth - b.depth);
}

// More development poses, with short rests at flush, full blossom and ripe fruit.
export const mangoFrames = [0, 0.18, 0.31, 0.43, 0.54, 0.65, 0.78, 1];
const sequence = [
  [0, 0],
  [0.12, 0],
  [0.22, 1],
  [0.32, 2],
  [0.4, 2],
  [0.49, 3],
  [0.56, 4],
  [0.65, 5],
  [0.74, 6],
  [0.83, 6],
  [0.97, 7],
  [1, 7],
];
export function mangoScene(progress: number) {
  const p = clamp(progress);
  let i = 0;
  while (i < sequence.length - 2 && p > sequence[i + 1][0]) i++;
  const [a, from] = sequence[i],
    [b, to] = sequence[i + 1];
  return {
    from,
    to,
    blend: smooth(a, b, p),
    stage:
      p < 0.22 ? "flush" : p < 0.48 ? "bloom" : p < 0.9 ? "fruit" : "evergreen",
  };
}
