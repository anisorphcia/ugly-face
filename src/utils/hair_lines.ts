export type Point = [number, number];
export type XY = { x: number; y: number };

/** 随机数 */
export function randomFromInterval(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

/** 阶乘 */
function factorial(n: number): number {
  if (n <= 1) return 1;
  return n * factorial(n - 1);
}

/** 二项式系数 */
function binomialCoefficient(n: number, k: number): number {
  return factorial(n) / (factorial(k) * factorial(n - k));
}

/** 单个贝塞尔曲线点 */
export function calculateBezierPoint(t: number, controlPoints: XY[]): Point {
  let x = 0,
    y = 0;
  const n = controlPoints.length - 1;

  for (let i = 0; i <= n; i++) {
    const binCoeff = binomialCoefficient(n, i);
    const a = Math.pow(1 - t, n - i);
    const b = Math.pow(t, i);

    x += binCoeff * a * b * controlPoints[i].x;
    y += binCoeff * a * b * controlPoints[i].y;
  }

  return [x, y];
}

/** 生成贝塞尔曲线 */
export function computeBezierCurve(
  controlPoints: XY[],
  numberOfPoints: number,
): Point[] {
  const curve: Point[] = [];

  for (let i = 0; i <= numberOfPoints; i++) {
    const t = i / numberOfPoints;
    curve.push(calculateBezierPoint(t, controlPoints));
  }

  return curve;
}

/* -------------------------------------------------------------------------- */
/*                             Hair Line Generator 0                          */
/* -------------------------------------------------------------------------- */

export function generateHairLines0(
  faceCountour: Point[],
  numHairLines: number = 100,
): Point[][] {
  const faceCountourCopy = faceCountour.slice(0, faceCountour.length - 2);
  const results: Point[][] = [];

  for (let i = 0; i < numHairLines; i++) {
    const numHairPoints = 20 + Math.floor(randomFromInterval(-5, 5));

    let hair_line: XY[] = [];
    let index_offset = Math.floor(randomFromInterval(30, 140));

    for (let j = 0; j < numHairPoints; j++) {
      const p =
        faceCountourCopy[
          (faceCountourCopy.length - (j + index_offset)) %
            faceCountourCopy.length
        ];
      hair_line.push({ x: p[0], y: p[1] });
    }

    const d0 = computeBezierCurve(hair_line, numHairPoints);

    // 第二条反向头发线
    hair_line = [];
    index_offset = Math.floor(randomFromInterval(30, 140));
    for (let j = 0; j < numHairPoints; j++) {
      const p =
        faceCountourCopy[
          (faceCountourCopy.length - (-j + index_offset)) %
            faceCountourCopy.length
        ];
      hair_line.push({ x: p[0], y: p[1] });
    }

    const d1 = computeBezierCurve(hair_line, numHairPoints);

    const d: Point[] = [];
    for (let j = 0; j < numHairPoints; j++) {
      const portion = (j * (1 / numHairPoints)) ** 2;
      d.push([
        d0[j][0] * portion + d1[j][0] * (1 - portion),
        d0[j][1] * portion + d1[j][1] * (1 - portion),
      ]);
    }

    results.push(d);
  }

  return results;
}

/* -------------------------------------------------------------------------- */
/*                             Hair Line Generator 1                          */
/* -------------------------------------------------------------------------- */

export function generateHairLines1(
  faceCountour: Point[],
  numHairLines: number = 100,
): Point[][] {
  const faceCountourCopy = faceCountour.slice(0, faceCountour.length - 2);
  const results: Point[][] = [];

  for (let i = 0; i < numHairLines; i++) {
    const numHairPoints = 20 + Math.floor(randomFromInterval(-5, 5));

    const hair_line: XY[] = [];
    let index_start = Math.floor(randomFromInterval(20, 160));

    hair_line.push({
      x: faceCountourCopy[
        (faceCountourCopy.length - index_start) % faceCountourCopy.length
      ][0],
      y: faceCountourCopy[
        (faceCountourCopy.length - index_start) % faceCountourCopy.length
      ][1],
    });

    for (let j = 1; j < numHairPoints + 1; j++) {
      index_start = Math.floor(randomFromInterval(20, 160));
      const p =
        faceCountourCopy[
          (faceCountourCopy.length - index_start) % faceCountourCopy.length
        ];
      hair_line.push({ x: p[0], y: p[1] });
    }

    results.push(computeBezierCurve(hair_line, numHairPoints));
  }

  return results;
}

/* -------------------------------------------------------------------------- */
/*                             Hair Line Generator 2                          */
/* -------------------------------------------------------------------------- */

export function generateHairLines2(
  faceCountour: Point[],
  numHairLines: number = 100,
): Point[][] {
  const faceCountourCopy = faceCountour.slice(0, faceCountour.length - 2);
  const results: Point[][] = [];

  const pickedIndices = Array.from({ length: numHairLines }, () =>
    Math.floor(randomFromInterval(10, 180)),
  ).sort((a, b) => a - b);

  for (let i = 0; i < numHairLines; i++) {
    const numHairPoints = 20 + Math.floor(randomFromInterval(-5, 5));
    const hair_line: XY[] = [];

    const index_offset = pickedIndices[i];
    const lower = randomFromInterval(0.8, 1.4);
    const reverse = Math.random() > 0.5 ? 1 : -1;

    for (let j = 0; j < numHairPoints; j++) {
      const powerscale = randomFromInterval(0.1, 3);
      const portion =
        (1 - (j / numHairPoints) ** powerscale) * (1 - lower) + lower;

      const p =
        faceCountourCopy[
          (faceCountourCopy.length - (reverse * j + index_offset)) %
            faceCountourCopy.length
        ];

      hair_line.push({ x: p[0] * portion, y: p[1] * portion });
    }

    let d = computeBezierCurve(hair_line, numHairPoints);
    if (Math.random() > 0.7) d = d.reverse();

    // 尝试合并到上一条
    if (results.length > 0) {
      const lastHair = results[results.length - 1];
      const lastPoint = lastHair[lastHair.length - 1];

      const dist = Math.sqrt(
        (d[0][0] - lastPoint[0]) ** 2 + (d[0][1] - lastPoint[1]) ** 2,
      );

      if (Math.random() > 0.5 && dist < 100) {
        results[results.length - 1] = lastHair.concat(d);
        continue;
      }
    }

    results.push(d);
  }

  return results;
}

/* -------------------------------------------------------------------------- */
/*                             Hair Line Generator 3                          */
/* -------------------------------------------------------------------------- */

export function generateHairLines3(
  faceCountour: Point[],
  numHairLines: number = 100,
): Point[][] {
  const faceCountourCopy = faceCountour.slice(0, faceCountour.length - 2);
  const results: Point[][] = [];

  const pickedIndices = Array.from({ length: numHairLines }, () =>
    Math.floor(randomFromInterval(10, 180)),
  ).sort((a, b) => a - b);

  const splitPoint = Math.floor(randomFromInterval(0, 200));

  for (let i = 0; i < numHairLines; i++) {
    const numHairPoints = 30 + Math.floor(randomFromInterval(-8, 8));
    const hair_line: XY[] = [];

    const index_offset = pickedIndices[i];
    let lower = randomFromInterval(1, 2.3);
    if (Math.random() > 0.9) lower = randomFromInterval(0, 1);

    const reverse = index_offset > splitPoint ? 1 : -1;

    for (let j = 0; j < numHairPoints; j++) {
      const powerscale = randomFromInterval(0.1, 3);
      const portion =
        (1 - (j / numHairPoints) ** powerscale) * (1 - lower) + lower;

      const p =
        faceCountourCopy[
          (faceCountourCopy.length - (reverse * j * 2 + index_offset)) %
            faceCountourCopy.length
        ];

      hair_line.push({ x: p[0] * portion, y: p[1] });
    }

    results.push(computeBezierCurve(hair_line, numHairPoints));
  }

  return results;
}
