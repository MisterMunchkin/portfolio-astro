import type { APIRoute } from "astro";
import { createTree, projectTree } from "../../utils/tree-geometry";

// A build-time image keeps the complete static artwork out of the page DOM.
export const GET: APIRoute = () => {
  const paths = projectTree(createTree(3), 600, 650, -0.38, 0.07, 1)
    .filter((face) => face.opacity > 0.01)
    .map(
      (face) =>
        `<path d="${face.points.map((p, i) => `${i ? "L" : "M"}${p.map((v) => v.toFixed(1)).join(",")}`).join(" ")}Z" fill="${face.fill}" stroke="${face.fill}"/>`,
    )
    .join("");
  return new Response(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 650" stroke-width=".35">${paths}</svg>`,
    { headers: { "Content-Type": "image/svg+xml; charset=utf-8" } },
  );
};
