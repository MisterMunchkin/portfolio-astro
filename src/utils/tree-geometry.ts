// A deterministic, original branching sculpture. Shared by the SVG and canvas.
export type Vec3 = [number, number, number];
export type TreeFace = {
  vertices: Vec3[];
  normal: Vec3;
  kind: "branch" | "leaf" | "flush" | "flower" | "panicle" | "fruit";
  anchor?: Vec3;
  tone: number;
};
const add = (a: Vec3, b: Vec3): Vec3 => a.map((n, i) => n + b[i]) as Vec3;
const mul = (a: Vec3, n: number): Vec3 => a.map((v) => v * n) as Vec3;
const sub = (a: Vec3, b: Vec3): Vec3 => add(a, mul(b, -1));
const cross = (a: Vec3, b: Vec3): Vec3 => [
  a[1] * b[2] - a[2] * b[1],
  a[2] * b[0] - a[0] * b[2],
  a[0] * b[1] - a[1] * b[0],
];
const unit = (a: Vec3): Vec3 => mul(a, 1 / (Math.hypot(...a) || 1));
const dot = (a: Vec3, b: Vec3) => a.reduce((s, n, i) => s + n * b[i], 0);
const mix = (a: Vec3, b: Vec3, t: number) => add(mul(a, 1 - t), mul(b, t));
const curve = (p: Vec3[], t: number): Vec3 =>
  add(
    add(mul(p[0], (1 - t) ** 3), mul(p[1], 3 * t * (1 - t) ** 2)),
    add(mul(p[2], 3 * t * t * (1 - t)), mul(p[3], t ** 3)),
  );

export function createTree(detail = 5): TreeFace[] {
  const faces: TreeFace[] = [];
  let seed = 2107;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  const face = (
    vertices: Vec3[],
    kind: TreeFace["kind"] = "branch",
    tone = 0,
    anchor?: Vec3,
  ) => {
    faces.push({
      vertices,
      normal: unit(
        cross(sub(vertices[1], vertices[0]), sub(vertices[2], vertices[0])),
      ),
      kind,
      anchor,
      tone,
    });
  };
  const tube = (points: Vec3[], radius: number, taper = 0.45) => {
    const rings: Vec3[][] = [];
    for (let i = 0; i <= detail; i++) {
      const t = i / detail,
        center = curve(points, t);
      const tangent = unit(
        sub(
          curve(points, Math.min(1, t + 0.01)),
          curve(points, Math.max(0, t - 0.01)),
        ),
      );
      const u = unit(cross(tangent, [0, 0, 1])),
        v = unit(cross(tangent, u));
      rings.push(
        Array.from({ length: 8 }, (_, j) =>
          add(
            center,
            add(
              mul(
                u,
                Math.cos((j * Math.PI) / 4) * radius * (1 - t * (1 - taper)),
              ),
              mul(
                v,
                Math.sin((j * Math.PI) / 4) * radius * (1 - t * (1 - taper)),
              ),
            ),
          ),
        ),
      );
    }
    for (let i = 0; i < detail; i++)
      for (let j = 0; j < 8; j++)
        face(
          [
            rings[i][j],
            rings[i][(j + 1) % 8],
            rings[i + 1][(j + 1) % 8],
            rings[i + 1][j],
          ],
          "branch",
          0.1 * random(),
        );
    face(rings[detail]);
  };
  const leaf = (center: Vec3, direction: Vec3, size: number, fresh = false) => {
    // Long, folded, lanceolate leaves, hanging in loose terminal rosettes.
    const side = unit(cross(direction, [0, 1, 0.2]));
    const tone = random(),
      kind = fresh ? "flush" : "leaf";
    const spine = [0, 0.28, 0.68, 1].map((t) =>
      add(add(center, mul(direction, size * t)), [0, -size * t * t * 0.3, 0]),
    );
    const widths = [0, 0.15, 0.12, 0];
    for (let i = 0; i < 3; i++)
      for (const sign of [-1, 1]) {
        const a = add(spine[i], mul(side, widths[i] * size * sign)),
          b = add(spine[i + 1], mul(side, widths[i + 1] * size * sign));
        const ridgeA = add(spine[i], [0, size * 0.035, 0]),
          ridgeB = add(spine[i + 1], [0, size * 0.035, 0]);
        face(
          sign === 1 ? [a, b, ridgeB, ridgeA] : [ridgeA, ridgeB, b, a],
          kind,
          tone,
          center,
        );
      }
  };
  const panicle = (base: Vec3, azimuth: number) => {
    const up: Vec3 = [Math.cos(azimuth) * 0.1, 0.25, Math.sin(azimuth) * 0.1];
    const tip = add(base, up);
    face(
      [base, add(base, [0.006, 0, 0]), add(tip, [0.006, 0, 0]), tip],
      "panicle",
      0,
      base,
    );
    for (let i = 0; i < 14; i++) {
      const t = (i + 0.5) / 14,
        a = i * 2.399,
        spread = (1 - t) * 0.085;
      const center = add(add(base, mul(up, t)), [
        Math.cos(a) * spread,
        0,
        Math.sin(a) * spread,
      ]);
      const radius = 0.012 + random() * 0.009;
      const joint = add(base, mul(up, t));
      face(
        [joint, add(joint, [0.004, 0, 0]), add(center, [0.004, 0, 0]), center],
        "panicle",
        0,
        base,
      );
      const points = [
        add(center, [radius, 0, 0]),
        add(center, [-radius, 0, 0]),
        add(center, [0, radius, 0.003]),
        add(center, [0, 0, -radius]),
      ];
      for (const indices of [
        [0, 1, 2],
        [0, 3, 1],
        [0, 2, 3],
        [1, 3, 2],
      ])
        face(
          indices.map((i) => points[i]),
          "flower",
          random(),
          base,
        );
    }
  };
  const mango = (attachment: Vec3, size: number, angle: number) => {
    const center = add(attachment, [0.02, -size * 0.85, 0]);
    const rings: Vec3[][] = [];
    for (let i = 0; i <= 7; i++) {
      const t = i / 7,
        r = Math.sin(Math.PI * t) ** 0.7;
      rings.push(
        Array.from({ length: 10 }, (_, j) => {
          const a = (j * Math.PI) / 5;
          const x =
            (Math.cos(a) * r * 0.46 + 0.16 * Math.sin(t * Math.PI * 1.3)) *
            size;
          const z = Math.sin(a) * r * 0.33 * size;
          return add(center, [
            x * Math.cos(angle) + z * Math.sin(angle),
            size * (0.65 - t * 1.4),
            -x * Math.sin(angle) + z * Math.cos(angle),
          ]);
        }),
      );
    }
    const tone = random();
    for (let i = 0; i < 7; i++)
      for (let j = 0; j < 10; j++)
        face(
          [
            rings[i][j],
            rings[i][(j + 1) % 10],
            rings[i + 1][(j + 1) % 10],
            rings[i + 1][j],
          ],
          "fruit",
          tone,
          attachment,
        );
    // A fine hanging stem is part of the fruit, and shares its lifecycle.
    face(
      [
        attachment,
        add(attachment, [0.009, 0, 0]),
        add(center, [0.009, size * 0.65, 0]),
        add(center, [0, size * 0.65, 0]),
      ],
      "fruit",
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
    const end = add(start, mul(dir, length));
    const points = [
      start,
      add(start, mul(dir, length * 0.3)),
      add(mix(start, end, 0.74), [0, -length * 0.12, 0]),
      end,
    ];
    tube(points, radius, depth === 0 ? 0.13 : 0.52);
    if (depth > 0) {
      grow(
        end,
        azimuth - 0.55 - random() * 0.45,
        Math.min(1.25, elevation * 0.7 + 0.1 + random() * 0.35),
        length * (0.64 + random() * 0.13),
        radius * 0.55,
        depth - 1,
      );
      grow(
        curve(points, 0.79),
        azimuth + 0.65 + random() * 0.6,
        0.45 + random() * 0.55,
        length * (0.61 + random() * 0.18),
        radius * 0.48,
        depth - 1,
      );
    }
    if (depth < 2) {
      for (let i = 0; i < (depth === 0 ? 6 : 3); i++) {
        const t = 0.35 + i * 0.085,
          angle = azimuth + i * 2.399;
        const position = curve(points, Math.min(0.98, t));
        leaf(
          position,
          unit([Math.cos(angle), -0.2 - random() * 0.65, Math.sin(angle)]),
          0.27 + random() * 0.12,
          i === 0 && depth === 0,
        );
      }
    }
    if (depth === 0) {
      panicle(end, azimuth);
      if (random() > 0.58)
        mango(curve(points, 0.8), 0.21 + random() * 0.09, azimuth);
    }
  };
  const trunk: Vec3[] = [
    [-0.06, -1.46, 0],
    [-0.36, -1.02, 0.06],
    [0.19, -0.48, -0.04],
    [0.04, -0.1, 0],
  ];
  tube(trunk, 0.13, 0.4);
  grow(curve(trunk, 0.53), 3.4, 0.34, 0.78, 0.058, 3);
  grow(curve(trunk, 0.7), 0.1, 0.55, 0.9, 0.061, 4);
  grow(curve(trunk, 0.94), 2.3, 0.71, 0.96, 0.055, 4);
  grow(curve(trunk, 0.98), 4.8, 0.95, 0.91, 0.045, 3);
  // Exposed roots anchor the sculpture, each following its own curved path.
  for (let i = 0; i < 7; i++) {
    const a = (i * 2 * Math.PI) / 7,
      end: Vec3 = [
        Math.cos(a) * (0.33 + random() * 0.15),
        -1.49,
        Math.sin(a) * 0.3,
      ];
    tube(
      [
        trunk[0],
        add(trunk[0], [Math.cos(a) * 0.13, -0.02, Math.sin(a) * 0.13]),
        add(end, [0, 0.025, 0]),
        end,
      ],
      0.052,
      0.04,
    );
  }
  return faces;
}

export function projectTree(
  mesh: TreeFace[],
  width: number,
  height: number,
  yaw = -0.38,
  pitch = 0.07,
  progress = 0,
) {
  const rotate = (p: Vec3): Vec3 => {
    const x = p[0] * Math.cos(yaw) + p[2] * Math.sin(yaw),
      z = -p[0] * Math.sin(yaw) + p[2] * Math.cos(yaw);
    return [
      x,
      p[1] * Math.cos(pitch) - z * Math.sin(pitch),
      p[1] * Math.sin(pitch) + z * Math.cos(pitch),
    ];
  };
  const light = unit([-0.7, 1.1, 1.8]);
  const life = mangoLifecycle(progress);
  const projected = mesh.map((face) => {
    const boundsVertices = face.vertices.map(rotate);
    const size = face.kind === "fruit" ? life.size : 1;
    const vertices =
        size !== 1 && face.anchor
          ? face.vertices
              .map((p) => add(face.anchor!, mul(sub(p, face.anchor!), size)))
              .map(rotate)
          : boundsVertices,
      normal = rotate(face.normal);
    const diffuse = Math.abs(dot(normal, light));
    const specular = Math.pow(
      Math.max(0, dot(normal, unit([-0.45, 0.65, 1.7]))),
      14,
    );
    const shade = 0.32 + diffuse * 0.56 + specular * 0.24;
    let color: number[] = [210, 172, 124],
      opacity = 1;
    if (face.kind === "leaf" || face.kind === "flush") {
      const mature = [
        93 + face.tone * 38,
        132 + face.tone * 30,
        62 + face.tone * 24,
      ];
      color =
        face.kind === "flush"
          ? mature.map(
              (v, i) => v * (1 - life.flush) + [166, 78, 62][i] * life.flush,
            )
          : mature;
    }
    if (face.kind === "flower") {
      color = [242, 218 + face.tone * 20, 180 + face.tone * 35];
      opacity = life.bloom;
    }
    if (face.kind === "panicle") {
      color = [178, 122, 96];
      opacity = life.bloom;
    }
    if (face.kind === "fruit") {
      color = [95, 147, 54].map(
        (v, i) =>
          v * (1 - life.ripe) + [244, 166 - face.tone * 48, 49][i] * life.ripe,
      );
      opacity = life.fruit;
    }
    const fill = `rgb(${color.map((v) => Math.round(Math.min(255, v * shade))).join(",")})`;
    return {
      points: vertices.map((p) => {
        const perspective = 7 / (7 - p[2]);
        return [p[0] * perspective, -p[1] * perspective];
      }),
      boundsPoints: boundsVertices.map((p) => {
        const perspective = 7 / (7 - p[2]);
        return [p[0] * perspective, -p[1] * perspective];
      }),
      depth: vertices.reduce((s, p) => s + p[2], 0) / vertices.length,
      fill,
      opacity,
    };
  });
  // Fit the whole silhouette, including its furthest leaves, at every angle.
  const bounds = projected.reduce(
    (b, face) => {
      for (const [x, y] of face.boundsPoints) {
        b[0] = Math.min(b[0], x);
        b[1] = Math.max(b[1], x);
        b[2] = Math.min(b[2], y);
        b[3] = Math.max(b[3], y);
      }
      return b;
    },
    [Infinity, -Infinity, Infinity, -Infinity],
  );
  const scale = Math.min(
    (width * 0.92) / (bounds[1] - bounds[0]),
    (height * 0.88) / (bounds[3] - bounds[2]),
  );
  const cx = (bounds[0] + bounds[1]) / 2,
    cy = (bounds[2] + bounds[3]) / 2;
  return projected
    .map((face) => ({
      ...face,
      points: face.points.map(([x, y]) => [
        width * 0.5 + (x - cx) * scale,
        height * 0.49 + (y - cy) * scale,
      ]),
    }))
    .sort((a, b) => a.depth - b.depth);
}

const smooth = (a: number, b: number, value: number) => {
  const t = Math.max(0, Math.min(1, (value - a) / (b - a)));
  return t * t * (3 - 2 * t);
};
export function mangoLifecycle(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  return {
    flush: 1 - smooth(0.08, 0.25, p),
    bloom: smooth(0.15, 0.31, p) * (1 - smooth(0.43, 0.57, p)),
    fruit: smooth(0.43, 0.59, p) * (1 - smooth(0.86, 0.98, p)),
    ripe: smooth(0.58, 0.79, p),
    size: 0.28 + 0.72 * smooth(0.44, 0.7, p),
    stage:
      p < 0.2 ? "flush" : p < 0.46 ? "bloom" : p < 0.88 ? "fruit" : "evergreen",
  };
}

// Hold each phase, then move through it. Pure scroll position: reversible and
// deterministic after reload, anchor navigation, resize or history restoration.
export const mangoFrames = [0, 0.34, 0.56, 0.76, 1];
const sequence = [
  [0, 0],
  [0.12, 0],
  [0.29, 1],
  [0.4, 1],
  [0.55, 2],
  [0.66, 3],
  [0.8, 3],
  [0.96, 4],
  [1, 4],
];
export function mangoScene(progress: number) {
  const p = Math.max(0, Math.min(1, progress));
  let index = 0;
  while (index < sequence.length - 2 && p > sequence[index + 1][0]) index++;
  const [a, from] = sequence[index],
    [b, to] = sequence[index + 1];
  const blend = smooth(a, b, p);
  return {
    from,
    to,
    blend,
    stage:
      p < 0.22 ? "flush" : p < 0.48 ? "bloom" : p < 0.9 ? "fruit" : "evergreen",
  };
}
