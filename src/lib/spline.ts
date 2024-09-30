
const control = (x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, t: number): number[] => {
  let d01: number = Math.sqrt(Math.pow(x1 - x0, 2) + Math.pow(y1 - y0, 2));
  let d12: number = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  let fa: number = (t * d01) / (d01 + d12);
  let fb: number = t - fa;
  let p1x: number = x1 + fa * (x0 - x2);
  let p1y: number = y1 + fa * (y0 - y2);
  let p2x: number = x1 - fb * (x0 - x2);
  let p2y: number = y1 - fb * (y0 - y2);

  return [p1x, p1y, p2x, p2y];
};

const spline = (pts: number[], t: number, path: CanvasRenderingContext2D) => {
  
  let i: number;
  let cp: number[] = [];
  let n: number;

  cp = []; // array of control points, as x0,y0,x1,y1,...
  n = pts.length;

  for (i = 0; i < n - 4; i += 2) {
    cp = cp.concat(
      control(
        pts[i],
        pts[i + 1],
        pts[i + 2],
        pts[i + 3],
        pts[i + 4],
        pts[i + 5],
        t
      )
    );
  }

  for (i = 2; i < pts.length - 5; i += 2) {
    path.moveTo(pts[i], pts[i + 1]);
    path.bezierCurveTo(
      cp[2 * i - 2],
      cp[2 * i - 1],
      cp[2 * i],
      cp[2 * i + 1],
      pts[i + 2],
      pts[i + 3]
    );
  }

  // path.moveTo(pts[0],pts[1]);
  // path.quadraticCurveTo(cp[0],cp[1],pts[2],pts[3]);
  // path.moveTo(pts[n-2],pts[n-1]);
  // path.quadraticCurveTo(cp[2*n-10],cp[2*n-9],pts[n-4],pts[n-3]);

  return path;
};

export default spline;
