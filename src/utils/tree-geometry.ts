// A deterministic, original branching sculpture. Shared by the SVG and canvas.
export type Vec3 = [number, number, number];
export type TreeFace = {
  vertices: Vec3[];
  normal: Vec3;
  leaf: boolean;
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
  const face = (vertices: Vec3[], leaf = false, tone = 0) => {
    faces.push({
      vertices,
      normal: unit(
        cross(sub(vertices[1], vertices[0]), sub(vertices[2], vertices[0])),
      ),
      leaf,
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
          false,
          0.1 * random(),
        );
    face(rings[detail]);
  };
  const leaf = (center: Vec3, direction: Vec3, size: number) => {
    const side = unit(cross(direction, [0, 1, 0.2]));
    const a = add(center, mul(direction, -size * 0.3)),
      b = add(center, mul(direction, size));
    const ridge = add(add(center, mul(direction, size * 0.35)), [
      0,
      size * 0.16,
      0,
    ]);
    const left = add(
      add(center, mul(direction, size * 0.3)),
      mul(side, size * 0.28),
    );
    const right = add(
      add(center, mul(direction, size * 0.3)),
      mul(side, -size * 0.28),
    );
    const tone = random();
    face([a, left, ridge], true, tone);
    face([left, b, ridge], true, tone);
    face([a, ridge, right], true, tone);
    face([ridge, b, right], true, tone);
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
      for (let i = 0; i < (depth === 0 ? 7 : 3); i++) {
        const t = 0.35 + i * 0.085,
          angle = azimuth + i * 2.399;
        const position = curve(points, Math.min(0.98, t));
        leaf(
          position,
          unit([Math.cos(angle), 0.35 + random() * 0.7, Math.sin(angle)]),
          0.13 + random() * 0.1,
        );
      }
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
  const projected = mesh.map((face) => {
    const vertices = face.vertices.map(rotate),
      normal = rotate(face.normal);
    const diffuse = Math.abs(dot(normal, light));
    const specular = Math.pow(
      Math.max(0, dot(normal, unit([-0.45, 0.65, 1.7]))),
      14,
    );
    const shade = 0.32 + diffuse * 0.56 + specular * 0.24;
    const color = face.leaf
      ? [164 + face.tone * 36, 177 + face.tone * 27, 91 + face.tone * 35]
      : [210, 172, 124];
    // A cool reflected edge keeps the warm metal distinct from the foliage.
    const reflected = (1 - diffuse) * progress * 14;
    const fill = `rgb(${color.map((v, i) => Math.round(Math.min(255, v * shade + (i === 2 ? reflected : 0)))).join(",")})`;
    return {
      points: vertices.map((p) => {
        const perspective = 7 / (7 - p[2]);
        return [p[0] * perspective, -p[1] * perspective];
      }),
      depth: vertices.reduce((s, p) => s + p[2], 0) / vertices.length,
      fill,
    };
  });
  // Fit the whole silhouette, including its furthest leaves, at every angle.
  const bounds = projected.reduce(
    (b, face) => {
      for (const [x, y] of face.points) {
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
