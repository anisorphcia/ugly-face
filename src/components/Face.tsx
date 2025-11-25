import { useEffect, useRef, useState, type CSSProperties } from "react";
import * as faceShape from "../utils/face_shape.js";
import * as eyeShape from "../utils/eye_shape.js";
import * as hairLines from "../utils/hair_lines.js";
import * as mouthShape from "../utils/mouth_shape.js";

type Point = [number, number];

function randomFromInterval(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

function pointsToString(points: [number, number][] | number[][]) {
  if (!points) return "";
  if (typeof points === "string") return points;
  // If it's an array of [x,y] pairs
  if (Array.isArray(points) && Array.isArray(points[0])) {
    return points.map((p) => `${p[0]},${p[1]}`).join(" ");
  }
  // fallback: join
  return points.join(" ");
}

export default function FaceGenerator() {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [faceScale, setFaceScale] = useState(1.8);
  const [computedFacePoints, setComputedFacePoints] = useState<Point[]>([]);
  const [eyeRightUpper, setEyeRightUpper] = useState<Point[]>([]);
  const [eyeRightLower, setEyeRightLower] = useState<Point[]>([]);
  const [eyeRightCountour, setEyeRightCountour] = useState<Point[]>([]);
  const [eyeLeftUpper, setEyeLeftUpper] = useState<Point[]>([]);
  const [eyeLeftLower, setEyeLeftLower] = useState<Point[]>([]);
  const [eyeLeftCountour, setEyeLeftCountour] = useState<Point[]>([]);
  const [_faceHeight, setFaceHeight] = useState(0);
  const [_faceWidth, setFaceWidth] = useState(0);
  const [center, setCenter] = useState([0, 0]);
  const [distanceBetweenEyes, setDistanceBetweenEyes] = useState(0);
  const [leftEyeOffsetX, setLeftEyeOffsetX] = useState(0);
  const [leftEyeOffsetY, setLeftEyeOffsetY] = useState(0);
  const [rightEyeOffsetX, setRightEyeOffsetX] = useState(0);
  const [rightEyeOffsetY, setRightEyeOffsetY] = useState(0);
  const [eyeHeightOffset, setEyeHeightOffset] = useState(0);
  const [_leftEyeCenter, setLeftEyeCenter] = useState([0, 0]);
  const [_rightEyeCenter, setRightEyeCenter] = useState([0, 0]);
  const [rightPupilShiftX, setRightPupilShiftX] = useState(0);
  const [rightPupilShiftY, setRightPupilShiftY] = useState(0);
  const [leftPupilShiftX, setLeftPupilShiftX] = useState(0);
  const [leftPupilShiftY, setLeftPupilShiftY] = useState(0);
  const [rightNoseCenterX, setRightNoseCenterX] = useState(0);
  const [rightNoseCenterY, setRightNoseCenterY] = useState(0);
  const [leftNoseCenterX, setLeftNoseCenterX] = useState(0);
  const [leftNoseCenterY, setLeftNoseCenterY] = useState(0);
  const [hairs, setHairs] = useState<Point[][]>([]);
  const [haventSleptForDays, setHaventSleptForDays] = useState(false);
  const hairColors = [
    "rgb(0, 0, 0)",
    "rgb(44, 34, 43)",
    "rgb(80, 68, 68)",
    "rgb(167, 133, 106)",
    "rgb(220, 208, 186)",
    "rgb(233, 236, 239)",
    "rgb(165, 42, 42)",
    "rgb(145, 85, 61)",
    "rgb(128, 128, 128)",
    "rgb(185, 55, 55)",
    "rgb(255, 192, 203)",
    "rgb(255, 105, 180)",
    "rgb(230, 230, 250)",
    "rgb(64, 224, 208)",
    "rgb(0, 191, 255)",
    "rgb(148, 0, 211)",
    "rgb(50, 205, 50)",
    "rgb(255, 165, 0)",
    "rgb(220, 20, 60)",
    "rgb(192, 192, 192)",
    "rgb(255, 215, 0)",
    "rgb(255, 255, 255)",
    "rgb(124, 252, 0)",
    "rgb(127, 255, 0)",
    "rgb(0, 255, 127)",
    "rgb(72, 209, 204)",
    "rgb(0, 255, 255)",
    "rgb(0, 206, 209)",
    "rgb(32, 178, 170)",
    "rgb(95, 158, 160)",
    "rgb(70, 130, 180)",
    "rgb(176, 196, 222)",
    "rgb(30, 144, 255)",
    "rgb(135, 206, 235)",
    "rgb(0, 0, 139)",
    "rgb(138, 43, 226)",
    "rgb(75, 0, 130)",
    "rgb(139, 0, 139)",
    "rgb(153, 50, 204)",
    "rgb(186, 85, 211)",
    "rgb(218, 112, 214)",
    "rgb(221, 160, 221)",
    "rgb(238, 130, 238)",
    "rgb(255, 0, 255)",
    "rgb(216, 191, 216)",
    "rgb(255, 20, 147)",
    "rgb(255, 69, 0)",
    "rgb(255, 140, 0)",
    "rgb(255, 165, 0)",
    "rgb(250, 128, 114)",
    "rgb(233, 150, 122)",
    "rgb(240, 128, 128)",
    "rgb(205, 92, 92)",
    "rgb(255, 99, 71)",
    "rgb(255, 160, 122)",
    "rgb(220, 20, 60)",
    "rgb(139, 0, 0)",
    "rgb(178, 34, 34)",
    "rgb(250, 235, 215)",
    "rgb(255, 239, 213)",
    "rgb(255, 235, 205)",
    "rgb(255, 222, 173)",
    "rgb(245, 245, 220)",
    "rgb(255, 228, 196)",
    "rgb(255, 218, 185)",
    "rgb(244, 164, 96)",
    "rgb(210, 180, 140)",
    "rgb(222, 184, 135)",
    "rgb(250, 250, 210)",
    "rgb(255, 250, 250)",
    "rgb(240, 255, 255)",
    "rgb(240, 255, 240)",
    "rgb(245, 245, 245)",
    "rgb(245, 255, 250)",
    "rgb(240, 248, 255)",
    "rgb(240, 248, 255)",
    "rgb(248, 248, 255)",
    "rgb(255, 250, 240)",
    "rgb(253, 245, 230)",
  ];
  const [hairColor, setHairColor] = useState("black");
  const [dyeColorOffset, setDyeColorOffset] = useState("50%");
  const backgroundColors = [
    "rgb(245, 245, 220)",
    "rgb(176, 224, 230)",
    "rgb(211, 211, 211)",
    "rgb(152, 251, 152)",
    "rgb(255, 253, 208)",
    "rgb(230, 230, 250)",
    "rgb(188, 143, 143)",
    "rgb(135, 206, 235)",
    "rgb(245, 255, 250)",
    "rgb(245, 222, 179)",
    "rgb(47, 79, 79)",
    "rgb(72, 61, 139)",
    "rgb(60, 20, 20)",
    "rgb(25, 25, 112)",
    "rgb(139, 0, 0)",
    "rgb(85, 107, 47)",
    "rgb(128, 0, 128)",
    "rgb(0, 100, 0)",
    "rgb(0, 0, 139)",
    "rgb(105, 105, 105)",
    "rgb(240, 128, 128)",
    "rgb(255, 160, 122)",
    "rgb(255, 218, 185)",
    "rgb(255, 228, 196)",
    "rgb(255, 222, 173)",
    "rgb(255, 250, 205)",
    "rgb(250, 250, 210)",
    "rgb(255, 239, 213)",
    "rgb(253, 245, 230)",
    "rgb(250, 240, 230)",
  ];
  const [mouthPoints, setMouthPoints] = useState<Point[]>([]);

  function generateFace() {
    setFaceScale(1.5 + Math.random() * 0.6);
    setHaventSleptForDays(Math.random() > 0.8);

    const faceResults = faceShape.generateFaceCountourPoints();
    console.log("faceResults", faceResults);
    setComputedFacePoints(faceResults.face);
    setFaceHeight(faceResults.height);
    setFaceWidth(faceResults.width);
    setCenter(faceResults.center);

    const eyes = eyeShape.generateBothEyes(faceResults.width / 2);
    const left = eyes.left;
    const right = eyes.right;

    setEyeRightUpper(right.upper);
    setEyeRightLower(right.lower);
    setEyeRightCountour(
      right.upper.slice(10, 90).concat(right.lower.slice(10, 90).reverse()),
    );
    setEyeLeftUpper(left.upper);
    setEyeLeftLower(left.lower);
    setEyeLeftCountour(
      left.upper.slice(10, 90).concat(left.lower.slice(10, 90).reverse()),
    );

    setDistanceBetweenEyes(
      randomFromInterval(faceResults.width / 4.5, faceResults.width / 4),
    );
    setEyeHeightOffset(
      randomFromInterval(faceResults.height / 8, faceResults.height / 6),
    );
    setLeftEyeOffsetX(
      randomFromInterval(-faceResults.width / 20, faceResults.width / 10),
    );
    setLeftEyeOffsetY(
      randomFromInterval(-faceResults.height / 50, faceResults.height / 50),
    );
    setRightEyeOffsetX(
      randomFromInterval(-faceResults.width / 20, faceResults.width / 10),
    );
    setRightEyeOffsetY(
      randomFromInterval(-faceResults.height / 50, faceResults.height / 50),
    );

    setLeftEyeCenter(left.center[0]);
    setRightEyeCenter(right.center[0]);

    // pupil shifts
    const leftInd0 = Math.floor(randomFromInterval(10, left.upper.length - 10));
    const rightInd0 = Math.floor(
      randomFromInterval(10, right.upper.length - 10),
    );
    const leftInd1 = Math.floor(randomFromInterval(10, left.upper.length - 10));
    const rightInd1 = Math.floor(
      randomFromInterval(10, right.upper.length - 10),
    );
    const leftLerp = randomFromInterval(0.2, 0.8);
    const rightLerp = randomFromInterval(0.2, 0.8);

    setLeftPupilShiftY(
      left.upper[leftInd0][1] * leftLerp +
        left.lower[leftInd1][1] * (1 - leftLerp),
    );
    setRightPupilShiftY(
      right.upper[rightInd0][1] * rightLerp +
        right.lower[rightInd1][1] * (1 - rightLerp),
    );
    setLeftPupilShiftX(
      left.upper[leftInd0][0] * leftLerp +
        left.lower[leftInd1][0] * (1 - leftLerp),
    );
    setRightPupilShiftX(
      right.upper[rightInd0][0] * rightLerp +
        right.lower[rightInd1][0] * (1 - rightLerp),
    );

    // hair
    const numHairLines = [];
    const numHairMethods = 4;
    for (let i = 0; i < numHairMethods; i++) {
      numHairLines.push(Math.floor(randomFromInterval(0, 50)));
    }
    let newHairs: Point[][] = [];
    if (Math.random() > 0.3) {
      newHairs = hairLines.generateHairLines0(
        faceResults.face,
        numHairLines[0] * 1 + 10,
      );
    }
    if (Math.random() > 0.3) {
      newHairs = newHairs.concat(
        hairLines.generateHairLines1(
          faceResults.face,
          numHairLines[1] / 1.5 + 10,
        ),
      );
    }
    if (Math.random() > 0.5) {
      newHairs = newHairs.concat(
        hairLines.generateHairLines2(
          faceResults.face,
          numHairLines[2] * 3 + 10,
        ),
      );
    }
    if (Math.random() > 0.5) {
      newHairs = newHairs.concat(
        hairLines.generateHairLines3(
          faceResults.face,
          numHairLines[3] * 3 + 10,
        ),
      );
    }
    setHairs(newHairs);

    setRightNoseCenterX(
      randomFromInterval(faceResults.width / 18, faceResults.width / 12),
    );
    setRightNoseCenterY(randomFromInterval(0, faceResults.height / 5));
    setLeftNoseCenterX(
      randomFromInterval(-faceResults.width / 18, -faceResults.width / 12),
    );
    setLeftNoseCenterY(
      randomFromInterval(
        randomFromInterval(0, faceResults.height / 5) - faceResults.height / 30,
        randomFromInterval(0, faceResults.height / 5) + faceResults.height / 20,
      ),
    );

    if (Math.random() > 0.1) {
      setHairColor(hairColors[Math.floor(Math.random() * 10)]);
    } else {
      setHairColor("url(#rainbowGradient)");
      setDyeColorOffset(randomFromInterval(0, 100) + "%");
    }

    const choice = Math.floor(Math.random() * 3);
    if (choice === 0) {
      setMouthPoints(
        mouthShape.generateMouthShape0(faceResults.height, faceResults.width),
      );
    } else if (choice === 1) {
      setMouthPoints(
        mouthShape.generateMouthShape1(faceResults.height, faceResults.width),
      );
    } else {
      setMouthPoints(
        mouthShape.generateMouthShape2(faceResults.height, faceResults.width),
      );
    }
  }

  function downloadSVGAsPNG() {
    const svg = svgRef.current;
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = document.createElement("img");
    const svgSize = svg.getBoundingClientRect();
    canvas.width = svgSize.width;
    canvas.height = svgSize.height;
    // encode SVG safely for base64 (handles non-ASCII characters)
    img.setAttribute(
      "src",
      "data:image/svg+xml;base64," +
        btoa(unescape(encodeURIComponent(svgData))),
    );
    img.onload = function () {
      if (!ctx) return;
      ctx.drawImage(img, 0, 0);
      const a = document.createElement("a");
      const e = new MouseEvent("click");
      a.download = "face.png";
      a.href = canvas.toDataURL("image/png");
      a.dispatchEvent(e);
    };
  }

  useEffect(() => {
    generateFace();
    const handler = (e: KeyboardEvent) => {
      if (e.key === " ") {
        e.preventDefault();
        generateFace();
      } else if (e.key === "s") {
        downloadSVGAsPNG();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // inline styles roughly converted from original scoped CSS
  const styles: {
    container: CSSProperties;
    svg: CSSProperties;
    button: CSSProperties;
  } = {
    container: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      display: "inline-flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#ffffff",
      padding: "5px",
    },
    svg: {
      backgroundColor: "#ffffff",
    },
    button: {
      marginTop: "10px",
      width: "200px",
      padding: "5px",
      background: "transparent",
      borderWidth: "2px",
      fontSize: "15px",
      borderColor: "black",
      color: "black",
      fontWeight: "bold",
      userSelect: "none",
      borderRadius: "10px",
      boxShadow: "2px 2px 0px 0px rgba(0,0,0,0.75)",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <svg
        ref={svgRef}
        viewBox="-100 -100 200 200"
        xmlns="http://www.w3.org/2000/svg"
        width="500"
        height="500"
        id="face-svg"
        style={styles.svg}
      >
        <defs>
          <clipPath id="leftEyeClipPath">
            <polyline points={pointsToString(eyeLeftCountour)} />
          </clipPath>
          <clipPath id="rightEyeClipPath">
            <polyline points={pointsToString(eyeRightCountour)} />
          </clipPath>

          <filter id="fuzzy">
            <feTurbulence
              id="turbulence"
              baseFrequency="0.05"
              numOctaves="3"
              type="noise"
              result="noise"
            />
            <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
          </filter>

          {/* 渐变头发 */}
          <linearGradient
            id="rainbowGradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop
              offset="0%"
              style={{
                stopColor: hairColors[Math.floor(Math.random() * 10)],
                stopOpacity: 1,
              }}
            />
            <stop
              offset={dyeColorOffset}
              style={{
                stopColor:
                  hairColors[Math.floor(Math.random() * hairColors.length)],
                stopOpacity: 1,
              }}
            />
            <stop
              offset="100%"
              style={{
                stopColor:
                  hairColors[Math.floor(Math.random() * hairColors.length)],
                stopOpacity: 1,
              }}
            />
          </linearGradient>
        </defs>
        {/* 背景 */}
        <rect
          x="-100"
          y="-100"
          width="100%"
          height="100%"
          fill={
            backgroundColors[
              Math.floor(Math.random() * backgroundColors.length)
            ]
          }
        />
        {/* 脸轮廓 */}
        <polyline
          id="faceContour"
          points={pointsToString(computedFacePoints)}
          fill="#ffc9a9"
          stroke="black"
          strokeWidth={3.0 / faceScale}
          strokeLinejoin="round"
          filter="url(#fuzzy)"
        />
        {/* 左眼轮廓 */}
        <g
          transform={
            "translate(" +
            (center[0] + distanceBetweenEyes + rightEyeOffsetX) +
            " " +
            -(-center[1] + eyeHeightOffset + rightEyeOffsetY) +
            ")"
          }
        >
          <polyline
            id="rightCountour"
            points={pointsToString(eyeRightCountour)}
            fill="white"
            stroke="white"
            strokeWidth={0.0 / faceScale}
            strokeLinejoin="round"
            filter="url(#fuzzy)"
          />
        </g>
        {/* 右眼轮廓 */}
        <g
          transform={
            "translate(" +
            -(center[0] + distanceBetweenEyes + leftEyeOffsetX) +
            " " +
            -(-center[1] + eyeHeightOffset + leftEyeOffsetY) +
            ")"
          }
        >
          <polyline
            id="leftCountour"
            points={pointsToString(eyeLeftCountour)}
            fill="white"
            stroke="white"
            strokeWidth={0.0 / faceScale}
            strokeLinejoin="round"
            filter="url(#fuzzy)"
          />
        </g>
        {/* 右眼 */}
        <g
          transform={
            "translate(" +
            (center[0] + distanceBetweenEyes + rightEyeOffsetX) +
            " " +
            -(-center[1] + eyeHeightOffset + rightEyeOffsetY) +
            ")"
          }
        >
          <polyline
            id="rightUpper"
            points={pointsToString(eyeRightUpper)}
            fill="none"
            stroke="black"
            strokeWidth={(haventSleptForDays ? 5.0 : 3.0) / faceScale}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#fuzzy)"
          />
          <polyline
            id="rightLower"
            points={pointsToString(eyeRightLower)}
            fill="none"
            stroke="black"
            strokeWidth={(haventSleptForDays ? 5.0 : 3.0) / faceScale}
            strokeLinejoin="round"
            strokeLinecap="round"
            filter="url(#fuzzy)"
          />
          {Array.from({ length: 10 }).map((_, i) => (
            <circle
              key={i}
              r={Math.random() * 2 + 3.0}
              cx={rightPupilShiftX + Math.random() * 5 - 2.5}
              cy={rightPupilShiftY + Math.random() * 5 - 2.5}
              stroke="black"
              fill="none"
              strokeWidth={1.0 + Math.random() * 0.5}
              filter="url(#fuzzy)"
              clipPath="url(#rightEyeClipPath)"
            />
          ))}
        </g>
        {/* 左眼 */}
        <g
          transform={
            "translate(" +
            -(center[0] + distanceBetweenEyes + leftEyeOffsetX) +
            " " +
            -(-center[1] + eyeHeightOffset + leftEyeOffsetY) +
            ")"
          }
        >
          <polyline
            id="leftUpper"
            points={pointsToString(eyeLeftUpper)}
            fill="none"
            stroke="black"
            strokeWidth={(haventSleptForDays ? 5.0 : 3.0) / faceScale}
            strokeLinejoin="round"
            filter="url(#fuzzy)"
          />
          <polyline
            id="leftLower"
            points={pointsToString(eyeLeftLower)}
            fill="none"
            stroke="black"
            strokeWidth={(haventSleptForDays ? 5.0 : 3.0) / faceScale}
            strokeLinejoin="round"
            filter="url(#fuzzy)"
          />
          {Array.from({ length: 10 }).map((_, i) => (
            <circle
              key={i}
              r={Math.random() * 2 + 3.0}
              cx={leftPupilShiftX + Math.random() * 5 - 2.5}
              cy={leftPupilShiftY + Math.random() * 5 - 2.5}
              stroke="black"
              fill="none"
              strokeWidth={1.0 + Math.random() * 0.5}
              filter="url(#fuzzy)"
              clipPath="url(#leftEyeClipPath)"
            />
          ))}
        </g>
        {/* 头发 */}
        <g id="hairs">
          {hairs.map((hair, idx) => (
            <polyline
              key={idx}
              points={pointsToString(hair)}
              fill="none"
              stroke={hairColor}
              strokeWidth={0.5 + Math.random() * 2.5}
              strokeLinejoin="round"
              filter="url(#fuzzy)"
            />
          ))}
        </g>
        {/* 鼻子 */}
        {Math.random() > 0.5 ? (
          <g id="pointNose">
            <g id="rightNose">
              {Array.from({ length: 10 }).map((_, i) => (
                <circle
                  key={i}
                  r={Math.random() * 2 + 1.0}
                  cx={rightNoseCenterX + Math.random() * 4 - 2}
                  cy={rightNoseCenterY + Math.random() * 4 - 2}
                  stroke="black"
                  fill="none"
                  strokeWidth={1.0 + Math.random() * 0.5}
                  filter="url(#fuzzy)"
                />
              ))}
            </g>
            <g id="leftNose">
              {Array.from({ length: 10 }).map((_, i) => (
                <circle
                  key={i}
                  r={Math.random() * 2 + 1.0}
                  cx={leftNoseCenterX + Math.random() * 4 - 2}
                  cy={leftNoseCenterY + Math.random() * 4 - 2}
                  stroke="black"
                  fill="none"
                  strokeWidth={1.0 + Math.random() * 0.5}
                  filter="url(#fuzzy)"
                />
              ))}
            </g>
          </g>
        ) : (
          <g id="lineNose">
            <path
              d={
                "M " +
                leftNoseCenterX +
                " " +
                leftNoseCenterY +
                ", Q" +
                rightNoseCenterX +
                " " +
                rightNoseCenterY * 1.5 +
                "," +
                (leftNoseCenterX + rightNoseCenterX) / 2 +
                " " +
                -eyeHeightOffset * 0.2
              }
              fill="none"
              stroke="black"
              strokeWidth={2.5 + Math.random() * 1.0}
              strokeLinejoin="round"
              filter="url(#fuzzy)"
            />
          </g>
        )}
        {/* 嘴巴 */}
        <g id="mouth">
          <polyline
            points={pointsToString(mouthPoints)}
            fill="rgb(215,127,140)"
            stroke="black"
            strokeWidth={2.7 + Math.random() * 0.5}
            strokeLinejoin="round"
            filter="url(#fuzzy)"
          />
        </g>
      </svg>

      <button
        type="button"
        onClick={generateFace}
        style={styles.button}
        aria-label="Generate another face"
      >
        ANOTHER
      </button>
      <button
        type="button"
        onClick={downloadSVGAsPNG}
        style={styles.button}
        aria-label="Download face PNG"
      >
        DOWNLOAD
      </button>
    </div>
  );
}
