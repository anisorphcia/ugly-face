// -------------------------
// Type Definitions
// -------------------------
export type Point = [number, number];

export interface IntersectionPoint {
  x: number;
  y: number;
}

export interface FaceContourResult {
  face: Point[];
  width: number;
  height: number;
  center: [number, number];
}

// -------------------------
// Utils
// -------------------------
export function randomFromInterval(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

// -------------------------
// Egg Shape
// -------------------------
export function getEggShapePoints(
  a: number,
  b: number,
  k: number,
  segment_points: number,
): Point[] {
  const result: Point[] = [];

  for (let i = 0; i < segment_points; i++) {
    const degree =
      (Math.PI / 2 / segment_points) * i +
      randomFromInterval(
        -Math.PI / 1.1 / segment_points,
        Math.PI / 1.1 / segment_points,
      );

    const y = Math.sin(degree) * b;
    const x =
      Math.sqrt(((1 - (y * y) / (b * b)) / (1 + k * y)) * a * a) +
      randomFromInterval(-a / 200, a / 200);

    result.push([x, y]);
  }

  for (let i = segment_points; i > 0; i--) {
    const degree =
      (Math.PI / 2 / segment_points) * i +
      randomFromInterval(
        -Math.PI / 1.1 / segment_points,
        Math.PI / 1.1 / segment_points,
      );

    const y = Math.sin(degree) * b;
    const x =
      -Math.sqrt(((1 - (y * y) / (b * b)) / (1 + k * y)) * a * a) +
      randomFromInterval(-a / 200, a / 200);

    result.push([x, y]);
  }

  for (let i = 0; i < segment_points; i++) {
    const degree =
      (Math.PI / 2 / segment_points) * i +
      randomFromInterval(
        -Math.PI / 1.1 / segment_points,
        Math.PI / 1.1 / segment_points,
      );

    const y = -Math.sin(degree) * b;
    const x =
      -Math.sqrt(((1 - (y * y) / (b * b)) / (1 + k * y)) * a * a) +
      randomFromInterval(-a / 200, a / 200);

    result.push([x, y]);
  }

  for (let i = segment_points; i > 0; i--) {
    const degree =
      (Math.PI / 2 / segment_points) * i +
      randomFromInterval(
        -Math.PI / 1.1 / segment_points,
        Math.PI / 1.1 / segment_points,
      );

    const y = -Math.sin(degree) * b;
    const x =
      Math.sqrt(((1 - (y * y) / (b * b)) / (1 + k * y)) * a * a) +
      randomFromInterval(-a / 200, a / 200);

    result.push([x, y]);
  }

  return result;
}

// -------------------------
// Intersection helper
// -------------------------
function findIntersectionPoints(
  radian: number,
  a: number,
  b: number,
): IntersectionPoint {
  radian = Math.max(0, Math.min(radian, Math.PI / 2));
  const m = Math.tan(radian);

  if (Math.abs(radian - Math.PI / 2) < 0.0001) {
    return { x: 0, y: b };
  }

  const y = m * a;
  if (y < b) {
    return { x: a, y };
  } else {
    return { x: b / m, y: b };
  }
}

// -------------------------
// Rectangular face contour
// -------------------------
export function generateRectangularFaceContourPoints(
  a: number,
  b: number,
  segment_points: number,
): Point[] {
  const result: Point[] = [];

  for (let i = 0; i < segment_points; i++) {
    const degree =
      (Math.PI / 2 / segment_points) * i +
      randomFromInterval(
        -Math.PI / 11 / segment_points,
        Math.PI / 11 / segment_points,
      );

    const intersection = findIntersectionPoints(degree, a, b);
    result.push([intersection.x, intersection.y]);
  }

  for (let i = segment_points; i > 0; i--) {
    const degree =
      (Math.PI / 2 / segment_points) * i +
      randomFromInterval(
        -Math.PI / 11 / segment_points,
        Math.PI / 11 / segment_points,
      );

    const intersection = findIntersectionPoints(degree, a, b);
    result.push([-intersection.x, intersection.y]);
  }

  for (let i = 0; i < segment_points; i++) {
    const degree =
      (Math.PI / 2 / segment_points) * i +
      randomFromInterval(
        -Math.PI / 11 / segment_points,
        Math.PI / 11 / segment_points,
      );

    const intersection = findIntersectionPoints(degree, a, b);
    result.push([-intersection.x, -intersection.y]);
  }

  for (let i = segment_points; i > 0; i--) {
    const degree =
      (Math.PI / 2 / segment_points) * i +
      randomFromInterval(
        -Math.PI / 11 / segment_points,
        Math.PI / 11 / segment_points,
      );

    const intersection = findIntersectionPoints(degree, a, b);
    result.push([intersection.x, -intersection.y]);
  }

  return result;
}

// -------------------------
// Final: Generate Face
// -------------------------
export function generateFaceCountourPoints(numPoints = 100): FaceContourResult {
  const faceSizeX0 = randomFromInterval(50, 100);
  const faceSizeY0 = randomFromInterval(70, 100);
  const faceSizeY1 = randomFromInterval(50, 80);
  const faceSizeX1 = randomFromInterval(70, 100);

  const faceK0 =
    randomFromInterval(0.001, 0.005) * (Math.random() > 0.5 ? 1 : -1);
  const faceK1 =
    randomFromInterval(0.001, 0.005) * (Math.random() > 0.5 ? 1 : -1);

  const face0TranslateX = randomFromInterval(-5, 5);
  const face0TranslateY = randomFromInterval(-15, 15);

  const face1TranslateX = randomFromInterval(-5, 25);
  const face1TranslateY = randomFromInterval(-5, 5);

  const eggOrRect0 = Math.random() > 0.1;
  const eggOrRect1 = Math.random() > 0.3;

  const results0 = eggOrRect0
    ? getEggShapePoints(faceSizeX0, faceSizeY0, faceK0, numPoints)
    : generateRectangularFaceContourPoints(faceSizeX0, faceSizeY0, numPoints);

  const results1 = eggOrRect1
    ? getEggShapePoints(faceSizeX1, faceSizeY1, faceK1, numPoints)
    : generateRectangularFaceContourPoints(faceSizeX1, faceSizeY1, numPoints);

  // Apply translation
  for (let i = 0; i < results0.length; i++) {
    results0[i][0] += face0TranslateX;
    results0[i][1] += face0TranslateY;
    results1[i][0] += face1TranslateX;
    results1[i][1] += face1TranslateY;
  }

  const results: Point[] = [];
  const center: Point = [0, 0];

  for (let i = 0; i < results0.length; i++) {
    const mix0 = results0[i];
    const mix1 = results1[(i + results0.length / 4) % results0.length];

    const x = mix0[0] * 0.7 + mix1[1] * 0.3;
    const y = mix0[1] * 0.7 - mix1[0] * 0.3;

    results.push([x, y]);
    center[0] += x;
    center[1] += y;
  }

  center[0] /= results.length;
  center[1] /= results.length;

  // center the shape
  for (let i = 0; i < results.length; i++) {
    results[i][0] -= center[0];
    results[i][1] -= center[1];
  }

  const width = results[0][0] - results[results.length / 2][0];
  const height =
    results[results.length / 4][1] - results[(results.length * 3) / 4][1];

  results.push(results[0]);
  results.push(results[1]);

  return {
    face: results,
    width,
    height,
    center: [0, 0],
  };
}
