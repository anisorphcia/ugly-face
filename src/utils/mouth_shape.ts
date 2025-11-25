type Point = [number, number];

export function randomFromInterval(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}

export function cubicBezier(
  P0: Point,
  P1: Point,
  P2: Point,
  P3: Point,
  t: number,
): Point {
  const x =
    (1 - t) ** 3 * P0[0] +
    3 * (1 - t) ** 2 * t * P1[0] +
    3 * (1 - t) * t ** 2 * P2[0] +
    t ** 3 * P3[0];

  const y =
    (1 - t) ** 3 * P0[1] +
    3 * (1 - t) ** 2 * t * P1[1] +
    3 * (1 - t) * t ** 2 * P2[1] +
    t ** 3 * P3[1];

  return [x, y];
}

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
      randomFromInterval(-a / 200.0, a / 200.0);

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
      randomFromInterval(-a / 200.0, a / 200.0);

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
      randomFromInterval(-a / 200.0, a / 200.0);

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
      randomFromInterval(-a / 200.0, a / 200.0);

    result.push([x, y]);
  }

  return result;
}

export function generateMouthShape0(
  faceHeight: number,
  faceWidth: number,
): Point[] {
  // const faceContourCopy = faceContour.slice(0, faceContour.length - 2);

  const mouthRightY = randomFromInterval(faceHeight / 7, faceHeight / 3.5);
  const mouthLeftY = randomFromInterval(faceHeight / 7, faceHeight / 3.5);

  const mouthRightX = randomFromInterval(faceWidth / 10, faceWidth / 2);
  const mouthLeftX =
    -mouthRightX + randomFromInterval(-faceWidth / 20, faceWidth / 20);

  const mouthRight: Point = [mouthRightX, mouthRightY];
  const mouthLeft: Point = [mouthLeftX, mouthLeftY];

  const controlPoint0: Point = [
    randomFromInterval(0, mouthRightX),
    randomFromInterval(mouthLeftY + 5, faceHeight / 1.5),
  ];

  const controlPoint1: Point = [
    randomFromInterval(mouthLeftX, 0),
    randomFromInterval(mouthLeftY + 5, faceHeight / 1.5),
  ];

  const mouthPoints: Point[] = [];

  for (let i = 0; i < 1; i += 0.01) {
    mouthPoints.push(
      cubicBezier(mouthLeft, controlPoint1, controlPoint0, mouthRight, i),
    );
  }

  if (Math.random() > 0.5) {
    for (let i = 0; i < 1; i += 0.01) {
      mouthPoints.push(
        cubicBezier(mouthRight, controlPoint0, controlPoint1, mouthLeft, i),
      );
    }
  } else {
    const y_offset_portion = randomFromInterval(0, 0.8);
    for (let i = 0; i < 100; i++) {
      mouthPoints.push([
        mouthPoints[99][0] * (1 - i / 100.0) + mouthPoints[0][0] * (i / 100.0),
        (mouthPoints[99][1] * (1 - i / 100.0) +
          mouthPoints[0][1] * (i / 100.0)) *
          (1 - y_offset_portion) +
          mouthPoints[99 - i][1] * y_offset_portion,
      ]);
    }
  }

  return mouthPoints;
}

export function generateMouthShape1(
  faceHeight: number,
  faceWidth: number,
): Point[] {
  // const faceContourCopy = faceContour.slice(0, faceContour.length - 2);

  const mouthRightY = randomFromInterval(faceHeight / 7, faceHeight / 4);
  const mouthLeftY = randomFromInterval(faceHeight / 7, faceHeight / 4);

  const mouthRightX = randomFromInterval(faceWidth / 10, faceWidth / 2);
  const mouthLeftX =
    -mouthRightX + randomFromInterval(-faceWidth / 20, faceWidth / 20);

  const mouthRight: Point = [mouthRightX, mouthRightY];
  const mouthLeft: Point = [mouthLeftX, mouthLeftY];

  const controlPoint0: Point = [
    randomFromInterval(0, mouthRightX),
    randomFromInterval(mouthLeftY + 5, faceHeight / 1.5),
  ];

  const controlPoint1: Point = [
    randomFromInterval(mouthLeftX, 0),
    randomFromInterval(mouthLeftY + 5, faceHeight / 1.5),
  ];

  const mouthPoints: Point[] = [];

  for (let i = 0; i < 1; i += 0.01) {
    mouthPoints.push(
      cubicBezier(mouthLeft, controlPoint1, controlPoint0, mouthRight, i),
    );
  }

  const center: Point = [
    (mouthRight[0] + mouthLeft[0]) / 2,
    mouthPoints[25][1] / 2 + mouthPoints[75][1] / 2,
  ];

  if (Math.random() > 0.5) {
    for (let i = 0; i < 1; i += 0.01) {
      mouthPoints.push(
        cubicBezier(mouthRight, controlPoint0, controlPoint1, mouthLeft, i),
      );
    }
  } else {
    const y_offset_portion = randomFromInterval(0, 0.8);
    for (let i = 0; i < 100; i++) {
      mouthPoints.push([
        mouthPoints[99][0] * (1 - i / 100.0) + mouthPoints[0][0] * (i / 100.0),
        (mouthPoints[99][1] * (1 - i / 100.0) +
          mouthPoints[0][1] * (i / 100.0)) *
          (1 - y_offset_portion) +
          mouthPoints[99 - i][1] * y_offset_portion,
      ]);
    }
  }

  // translate / rotate / scale
  for (let i = 0; i < mouthPoints.length; i++) {
    mouthPoints[i][0] -= center[0];
    mouthPoints[i][1] -= center[1];

    mouthPoints[i][1] = -mouthPoints[i][1]; // rotate 180° (flip)

    mouthPoints[i][0] *= 0.6;
    mouthPoints[i][1] *= 0.6;

    mouthPoints[i][0] += center[0];
    mouthPoints[i][1] += center[1] * 0.8;
  }

  return mouthPoints;
}

export function generateMouthShape2(
  faceHeight: number,
  faceWidth: number,
): Point[] {
  const center: Point = [
    randomFromInterval(-faceWidth / 8, faceWidth / 8),
    randomFromInterval(faceHeight / 4, faceHeight / 2.5),
  ];

  const mouthPoints = getEggShapePoints(
    randomFromInterval(faceWidth / 4, faceWidth / 10),
    randomFromInterval(faceHeight / 10, faceHeight / 20),
    0.001,
    50,
  );

  const angle = randomFromInterval(-Math.PI / 9.5, Math.PI / 9.5);

  for (let i = 0; i < mouthPoints.length; i++) {
    const x = mouthPoints[i][0];
    const y = mouthPoints[i][1];

    mouthPoints[i][0] = x * Math.cos(angle) - y * Math.sin(angle);
    mouthPoints[i][1] = x * Math.sin(angle) + y * Math.cos(angle);

    mouthPoints[i][0] += center[0];
    mouthPoints[i][1] += center[1];
  }

  return mouthPoints;
}
