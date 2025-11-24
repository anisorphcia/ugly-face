// ---------------- Types ----------------

export type Point = [number, number];

export interface EyeParams {
  height_upper: number;
  height_lower: number;
  P0_upper_randX: number;
  P3_upper_randX: number;
  P0_upper_randY: number;
  P3_upper_randY: number;
  offset_upper_left_randY: number;
  offset_upper_right_randY: number;
  eye_true_width: number;
  offset_upper_left_x: number;
  offset_upper_right_x: number;
  offset_upper_left_y: number;
  offset_upper_right_y: number;
  offset_lower_left_x: number;
  offset_lower_right_x: number;
  offset_lower_left_y: number;
  offset_lower_right_y: number;
  left_converge0: number;
  right_converge0: number;
  left_converge1: number;
  right_converge1: number;
}

export interface EyePoints {
  upper: Point[];
  lower: Point[];
  center: [Point];
}

export interface BothEyes {
  left: EyePoints;
  right: EyePoints;
}

// ---------------- Utils ----------------

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

// ---------------- Generators ----------------

export function generateEyeParameters(width: number): EyeParams {
  const height_upper = (Math.random() * width) / 1.2;
  const height_lower = (Math.random() * width) / 1.2;

  const P0_upper_randX = Math.random() * 0.4 - 0.2;
  const P3_upper_randX = Math.random() * 0.4 - 0.2;
  const P0_upper_randY = Math.random() * 0.4 - 0.2;
  const P3_upper_randY = Math.random() * 0.4 - 0.2;

  const offset_upper_left_randY = Math.random();
  const offset_upper_right_randY = Math.random();

  const P0_upper: Point = [
    -width / 2 + (P0_upper_randX * width) / 16,
    (P0_upper_randY * height_upper) / 16,
  ];

  const P3_upper: Point = [
    width / 2 + (P3_upper_randX * width) / 16,
    (P3_upper_randY * height_upper) / 16,
  ];

  const eye_true_width = P3_upper[0] - P0_upper[0];

  const offset_upper_left_x = randomFromInterval(
    -eye_true_width / 10.0,
    eye_true_width / 2.3,
  );
  const offset_upper_right_x = randomFromInterval(
    -eye_true_width / 10.0,
    eye_true_width / 2.3,
  );
  const offset_upper_left_y = offset_upper_left_randY * height_upper;
  const offset_upper_right_y = offset_upper_right_randY * height_upper;

  const offset_lower_left_x = randomFromInterval(
    offset_upper_left_x,
    eye_true_width / 2.1,
  );
  const offset_lower_right_x = randomFromInterval(
    offset_upper_right_x,
    eye_true_width / 2.1,
  );
  const offset_lower_left_y = randomFromInterval(
    -offset_upper_left_y + 5,
    height_lower,
  );
  const offset_lower_right_y = randomFromInterval(
    -offset_upper_right_y + 5,
    height_lower,
  );

  const left_converge0 = Math.random();
  const right_converge0 = Math.random();
  const left_converge1 = Math.random();
  const right_converge1 = Math.random();

  return {
    height_upper,
    height_lower,
    P0_upper_randX,
    P3_upper_randX,
    P0_upper_randY,
    P3_upper_randY,
    offset_upper_left_randY,
    offset_upper_right_randY,
    eye_true_width,
    offset_upper_left_x,
    offset_upper_right_x,
    offset_upper_left_y,
    offset_upper_right_y,
    offset_lower_left_x,
    offset_lower_right_x,
    offset_lower_left_y,
    offset_lower_right_y,
    left_converge0,
    right_converge0,
    left_converge1,
    right_converge1,
  };
}

export function generateEyePoints(
  rands: EyeParams,
  width: number = 50,
): EyePoints {
  const P0_upper: Point = [
    -width / 2 + (rands.P0_upper_randX * width) / 16,
    (rands.P0_upper_randY * rands.height_upper) / 16,
  ];
  const P3_upper: Point = [
    width / 2 + (rands.P3_upper_randX * width) / 16,
    (rands.P3_upper_randY * rands.height_upper) / 16,
  ];

  const P0_lower = P0_upper;
  const P3_lower = P3_upper;

  // Upper control points
  const P1_upper: Point = [
    P0_upper[0] + rands.offset_upper_left_x,
    P0_upper[1] + rands.offset_upper_left_y,
  ];

  const P2_upper: Point = [
    P3_upper[0] - rands.offset_upper_right_x,
    P3_upper[1] + rands.offset_upper_right_y,
  ];

  // Lower control points
  const P1_lower: Point = [
    P0_lower[0] + rands.offset_lower_left_x,
    P0_lower[1] - rands.offset_lower_left_y,
  ];

  const P2_lower: Point = [
    P3_lower[0] - rands.offset_lower_right_x,
    P3_lower[1] - rands.offset_lower_right_y,
  ];

  const upper_eyelid_points: Point[] = [];
  const lower_eyelid_points: Point[] = [];

  const upper_eyelid_points_left_control: Point[] = [];
  const upper_eyelid_points_right_control: Point[] = [];

  const lower_eyelid_points_left_control: Point[] = [];
  const lower_eyelid_points_right_control: Point[] = [];

  const upper_left_ctrl: Point = [
    P0_upper[0] * (1 - rands.left_converge0) +
      P1_lower[0] * rands.left_converge0,
    P0_upper[1] * (1 - rands.left_converge0) +
      P1_lower[1] * rands.left_converge0,
  ];

  const upper_right_ctrl: Point = [
    P3_upper[0] * (1 - rands.right_converge0) +
      P2_lower[0] * rands.right_converge0,
    P3_upper[1] * (1 - rands.right_converge0) +
      P2_lower[1] * rands.right_converge0,
  ];

  // Generate curves
  for (let t = 0; t < 100; t++) {
    const tt = t / 100;

    upper_eyelid_points.push(
      cubicBezier(P0_upper, P1_upper, P2_upper, P3_upper, tt),
    );
    upper_eyelid_points_left_control.push(
      cubicBezier(upper_left_ctrl, P0_upper, P1_upper, P2_upper, tt),
    );
    upper_eyelid_points_right_control.push(
      cubicBezier(P1_upper, P2_upper, P3_upper, upper_right_ctrl, tt),
    );
  }

  for (let i = 0; i < 75; i++) {
    const weight = ((75 - i) / 75) ** 2;
    upper_eyelid_points[i] = [
      upper_eyelid_points[i][0] * (1 - weight) +
        upper_eyelid_points_left_control[i + 25][0] * weight,
      upper_eyelid_points[i][1] * (1 - weight) +
        upper_eyelid_points_left_control[i + 25][1] * weight,
    ];
    upper_eyelid_points[i + 25] = [
      upper_eyelid_points[i + 25][0] * weight +
        upper_eyelid_points_right_control[i][0] * (1 - weight),
      upper_eyelid_points[i + 25][1] * weight +
        upper_eyelid_points_right_control[i][1] * (1 - weight),
    ];
  }

  // Lower eyelid
  const lower_left_ctrl: Point = [
    P0_lower[0] * (1 - rands.left_converge0) +
      P1_upper[0] * rands.left_converge0,
    P0_lower[1] * (1 - rands.left_converge0) +
      P1_upper[1] * rands.left_converge0,
  ];

  const lower_right_ctrl: Point = [
    P3_lower[0] * (1 - rands.right_converge1) +
      P2_upper[0] * rands.right_converge1,
    P3_lower[1] * (1 - rands.right_converge1) +
      P2_upper[1] * rands.right_converge1,
  ];

  for (let t = 0; t < 100; t++) {
    const tt = t / 100;
    lower_eyelid_points.push(
      cubicBezier(P0_lower, P1_lower, P2_lower, P3_lower, tt),
    );
    lower_eyelid_points_left_control.push(
      cubicBezier(lower_left_ctrl, P0_lower, P1_lower, P2_lower, tt),
    );
    lower_eyelid_points_right_control.push(
      cubicBezier(P1_lower, P2_lower, P3_lower, lower_right_ctrl, tt),
    );
  }

  for (let i = 0; i < 75; i++) {
    const weight = ((75 - i) / 75) ** 2;
    lower_eyelid_points[i] = [
      lower_eyelid_points[i][0] * (1 - weight) +
        lower_eyelid_points_left_control[i + 25][0] * weight,
      lower_eyelid_points[i][1] * (1 - weight) +
        lower_eyelid_points_left_control[i + 25][1] * weight,
    ];
    lower_eyelid_points[i + 25] = [
      lower_eyelid_points[i + 25][0] * weight +
        lower_eyelid_points_right_control[i][0] * (1 - weight),
      lower_eyelid_points[i + 25][1] * weight +
        lower_eyelid_points_right_control[i][1] * (1 - weight),
    ];
  }

  // Flip Y
  for (let i = 0; i < 100; i++) {
    upper_eyelid_points[i][1] = -upper_eyelid_points[i][1];
    lower_eyelid_points[i][1] = -lower_eyelid_points[i][1];
  }

  // Center
  const eyeCenter: Point = [
    (upper_eyelid_points[50][0] + lower_eyelid_points[50][0]) / 2,
    (upper_eyelid_points[50][1] + lower_eyelid_points[50][1]) / 2,
  ];

  for (let i = 0; i < 100; i++) {
    upper_eyelid_points[i][0] -= eyeCenter[0];
    upper_eyelid_points[i][1] -= eyeCenter[1];
    lower_eyelid_points[i][0] -= eyeCenter[0];
    lower_eyelid_points[i][1] -= eyeCenter[1];
  }

  return {
    upper: upper_eyelid_points,
    lower: lower_eyelid_points,
    center: [[0, 0]],
  };
}

export function generateBothEyes(width: number = 50): BothEyes {
  const rands_left = generateEyeParameters(width);
  const rands_right: EyeParams = { ...rands_left };

  for (const key in rands_right) {
    const val = rands_right[key as keyof EyeParams];
    if (typeof val === "number") {
      rands_right[key as keyof EyeParams] =
        val + randomFromInterval(-val / 2, val / 2);
    }
  }

  const left_eye = generateEyePoints(rands_left, width);
  const right_eye = generateEyePoints(rands_right, width);

  // Mirror left eye horizontally
  for (const key in left_eye) {
    const arr = left_eye[key as keyof EyePoints];
    if (Array.isArray(arr)) {
      for (let i = 0; i < arr.length; i++) {
        arr[i][0] = -arr[i][0];
      }
    }
  }

  return { left: left_eye, right: right_eye };
}
