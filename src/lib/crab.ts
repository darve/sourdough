
import Vec from './vec';
import polybool from 'polybooljs';
import area from 'area-polygon';
import pip from 'point-in-polygon';
import { form_polygon, form_circle } from './form';
import { checkIntersection } from 'line-intersect';

export const line_array_to_polyline = lines => {

}

export const polyline_to_line_array = lines => {

}

export const polylines_to_lines = lines => {
    let piss = [];

    lines.map( (pc, pci) => {
        let prev = null;
        pc.map( (pce, pcie) => {
            if (prev === null) {
            } else {
                piss.push([prev, pce]);
            }
            prev = pce;
        });
    });   

    return piss;
}

/**
 * Helpful canvas drawing functions.
 */
export const line = (cx: CanvasRenderingContext2D, start: number[], end: number[]) => {
    cx.beginPath();
    cx.moveTo(start[0], start[1]);
    cx.lineTo(end[0], end[1]);
    cx.stroke();
};

export const dot = (cx: CanvasRenderingContext2D, pos: number[], r: number, fill: boolean = true) => {
	cx.translate(pos[0], pos[1]);
    cx.beginPath();
    cx.arc(0, 0, r*2, 0, 2 * Math.PI, false);
    cx.closePath();
    if (fill) cx.fill();
    if (!fill) cx.stroke();
    cx.setTransform(1, 0, 0, 1, 0, 0);
};

export const ring = (cx: CanvasRenderingContext2D, pos: number[], r: number, s: number) => {
    cx.translate(pos[0], pos[1]);
    cx.beginPath();
    cx.arc(0, 0, r*2, 0, 2 * Math.PI, false);
    cx.closePath();
    let sw = Number(cx.lineWidth);
    cx.lineWidth = s;
    cx.stroke();
    cx.lineWidth = sw;
    cx.setTransform(1, 0, 0, 1, 0, 0);
};

export const fill = (cx: CanvasRenderingContext2D, dimensions: number[], colour: string, modifier: number[]) => {
    cx.fillStyle = colour;
    if (!modifier) {
        cx.fillRect(0, 0, dimensions[0], dimensions[1]);
    } else {
        cx.fillRect(modifier[0], modifier[1], dimensions[0], dimensions[1]);
    }  
};

export const rotate_polyline = (line: [number[]], modifier: number[] = [0,0], origin: number[] = [0, 0], angle: number) => {
    let tmp = [];   
    let point = new Vec(origin[0], origin[1]);
    line.map( (pt, index) => {
        let v = new Vec(pt[0]+modifier[0], pt[1]+modifier[1]);
        tmp.push(
            [
                v.rotate(angle, true).x,
                v.rotate(angle, true).y
            ]
        );
    });
    return tmp;
}

export const draw_line = (cx: CanvasRenderingContext2D, line: [number[]]) => {
    cx.beginPath();
    cx.moveTo(line[0], line[1]);
    cx.lineTo(line[2], line[3]);
    cx.stroke();
}

export const draw_polyline = (cx: CanvasRenderingContext2D, line: [number[]], closed: boolean, modifier: number[] = [0,0]) => {
    cx.beginPath();
    line.map( (pt, index) => {
        if (index === 0) cx.moveTo(pt[0]+modifier[0], pt[1]+modifier[1]);
        else cx.lineTo(pt[0]+modifier[0], pt[1]+modifier[1]);
    });
    if (closed) cx.lineTo(line[0][0]+modifier[0], line[0][1]+modifier[1]);
    cx.stroke();
}

export const draw_polylines = (cx: CanvasRenderingContext2D, lines: [[number[]]], closed: boolean, modifier: number[] = [0, 0]) => {
    lines.map( (l, index) => {
        // let m = [Math.random() * 5, Math.random() * 5];
        draw_polyline(cx, l, closed, modifier);
    });
}

export const draw_split = (cx: CanvasRenderingContext2D, lines: [[number[]]], closed: boolean, modifier: number[] = [0, 0]) => {
    let oddeven = true;
    lines.map( (l, index) => {
        let mod = oddeven ? [modifier[0], modifier[1]] : [-modifier[0], -modifier[1]];
        draw_polyline(cx, l, closed, mod);
        oddeven = !oddeven;
    });
}

export const img_center = (cx: CanvasRenderingContext2D, dimensions: number[], img: HTMLImageElement, modifier: number[]) => {
    let { width, height } = img;
    let w2 = width/2;
    let h2 = height/2;
    cx.drawImage(img, ((dimensions[0]/2)-w2)+modifier[0], ((dimensions[1]/2)-h2)+modifier[1]);
};

export const video_center = (cx: CanvasRenderingContext2D, dimensions: number[], vid: HTMLVideoElement, modifier: number[]) => {
    
    let { videoWidth, videoHeight } = vid;
    let width = dimensions[0];
    let height = width * (videoHeight/videoWidth);
    let w2 = width/2;
    let h2 = height/2;

    cx.drawImage(vid, modifier[0], modifier[1], width, height);
};

export const img_spin = (cx: CanvasRenderingContext2D, dimensions: number[], img: HTMLImageElement, modifier: number[], rotation: number) => {

    let { width, height } = img;
    let w2 = width/2;
    let h2 = height/2;

    cx.translate(dimensions[0]/2, dimensions[1]/2);
    cx.rotate(rotation);
    cx.drawImage(img, -w2, -h2, width, height);
    cx.setTransform(1, 0, 0, 1, 0, 0);
}

export const magnitude = (a: number[], b: number[]) => {
    let x = a[0]-b[0];
    let y = a[1]-b[1];
    return Math.sqrt((x*x)+(y*y));
};

export const colour_change = (a: string, b: string, amount: number) => { 
    // console.log(a, b, amount);

    var ah = parseInt(a.replace(/#/g, ''), 16),
        ar = ah >> 16, ag = ah >> 8 & 0xff, ab = ah & 0xff,
        bh = parseInt(b.replace(/#/g, ''), 16),
        br = bh >> 16, bg = bh >> 8 & 0xff, bb = bh & 0xff,
        rr = ar + amount * (br - ar),
        rg = ag + amount * (bg - ag),
        rb = ab + amount * (bb - ab);

    return '#' + ((1 << 24) + (rr << 16) + (rg << 8) + rb | 0).toString(16).slice(1);
}

export const hex_to_rgba = (hex, alpha) => {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `rgba(${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}, ${alpha})` : null;
}

export const video_frames = (vid: HTMLVideoElement, fps: number) => {
    return Math.floor((vid.duration*1000)/fps)
}

export const get_bounds = (poly: [[number[]]]) => {

    let min_x = Infinity;
    let min_y = Infinity;
    let max_x = -Infinity;
    let max_y = -Infinity;

    // debugger;

    // poly.map( (pol, pol_index)=> {
        poly.map( (lin, lin_index) => {
            if (lin[0] < min_x ) min_x = lin[0];
            if (lin[1] < min_y ) min_y = lin[1];
            if (lin[0] > max_x ) max_x = lin[0];
            if (lin[1] > max_y) max_y = lin[1];
        });
    // });

    let pos = [min_x, min_y];
    let size = [Math.abs(min_x-max_x), Math.abs(min_y-max_y)];
    let center = [pos[0]+(size[0]/2), pos[1]+(size[1]/2)];

    return {
        pos,
        size,
        center
    };

    // return { min_x, min_y, max_x, max_y };
};

export const get_size = (poly: [[number[]]]) => {

    let min_x = Infinity;
    let min_y = Infinity;
    let max_x = -Infinity;
    let max_y = -Infinity;

    poly.map( (pol, pol_index)=> {
        pol.map( (lin, lin_index) => {
            lin.map( (pt, pt_index) => {
                if (pt[0] < min_x ) min_x = pt[0];
                if (pt[1] < min_y ) min_y = pt[1];
                if (pt[0] > max_x ) max_x = pt[0];
                if (pt[1] > max_y) max_y = pt[1];
            });
        });
    });

    let pos = [min_x, min_y];
    let size = [Math.abs(min_x-max_x), Math.abs(min_y-max_y)];
    let center = [pos[0]+(size[0]/2), pos[1]+(size[1]/2)];

    return {
        pos,
        size,
        center
    };

};

export const scale_figure = (poly: [[number[]]], scale: number) => {
    return poly.map( (pol, pol_index)=> {
        return pol.map( (lin, lin_index) => {
            return lin.map( (pt, pt_index) => {
                return [pt[0]*scale, pt[1]*scale];
            });
        });
    });
};

export const translate_figure = (poly: [[number[]]], pos: number[]) => {

    return poly.map( (pol, pol_index)=> {
        return pol.map( (lin, lin_index) => {
            return lin.map( (pt, pt_index) => {
                return [pt[0]+pos[0], pt[1]+pos[1]];
            });
        });
    });
};

export const split_poly = (cx: CanvasRenderingContext2D, poly: [[number[]]], pos: number[], dir: number[], force: number) => {
    
    let _dir = new Vec(dir[0], dir[1]);
    let _pos = new Vec(pos[0], pos[1]);

    let _to = _pos.plusNew(_dir.multiplyNew(9999));
    let _from = _pos.minusNew(_dir.multiplyNew(9999));

    // let _normal = _pos.minusNew(_dir).normalise().rotate(180);
    let _normal = _dir.normalise().rotate(Math.PI/2, true);

    let divider = [
        [_from.x-_normal.x, _from.y-_normal.y],
        [_to.x-_normal.x, _to.y-_normal.y],
        [_to.x+_normal.x, _to.y+_normal.y],
        [_from.x+_normal.x, _from.y+_normal.y]
    ];

    let bool = polybool.difference(
        { regions: [poly], inverted: false },
        { regions: [divider], inverted: false }
    );

    let tangent = new Vec(_normal.x, _normal.y).normalise();
    tangent = tangent.multiplyEq(force);

    // cx.beginPath();
    // cx.moveTo(_from.x, _from.y);
    // cx.lineTo(_to.x, _to.y);
    // cx.stroke();

    bool.tangent = [tangent.x, tangent.y];

    let reg = [];

    bool.regions[0] = bool.regions[0].map( (bp, bpi) => {
        return [Number(bp[0])+Number(tangent.x), Number(bp[1])+Number(tangent.y)]
    });

    bool.regions[1] = bool.regions[1].map( (bp, bpi) => {
        return [Number(bp[0])-Number(tangent.x), Number(bp[1])-Number(tangent.y)]
    });
    
    return bool;
}
export const split_poly_from_center = (cx: CanvasRenderingContext2D, poly: [[number[]]], pos: number[], dir: number[], force: number) => {
    
    let bounds = get_bounds(poly);
    // console.log(bounds);

    let _dir = new Vec(dir[0], dir[1]);
    let _pos = new Vec(bounds.center[0], bounds.center[1]);

    let _to = _pos.plusNew(_dir.multiplyNew(9999));
    let _from = _pos.minusNew(_dir.multiplyNew(9999));

    // let _normal = _pos.minusNew(_dir).normalise().rotate(180);
    let _normal = _dir.normalise().rotate(Math.PI/2, true);

    let divider = [
        [_from.x-_normal.x, _from.y-_normal.y],
        [_to.x-_normal.x, _to.y-_normal.y],
        [_to.x+_normal.x, _to.y+_normal.y],
        [_from.x+_normal.x, _from.y+_normal.y]
    ];

    let bool = polybool.difference(
        { regions: [poly], inverted: false },
        { regions: [divider], inverted: false }
    );

    // console.log(bool);

    let tangent = new Vec(_normal.x, _normal.y).normalise();
    tangent = tangent.multiplyEq(force);

    // cx.beginPath();
    // cx.moveTo(_from.x, _from.y);
    // cx.lineTo(_to.x, _to.y);
    // cx.stroke();

    bool.tangent = [tangent.x, tangent.y];

    let reg = [];
    // debugger;
    bool.regions[0] = bool.regions[0].map( (bp, bpi) => {
        return [Number(bp[0])-Number(tangent.x), Number(bp[1])-Number(tangent.y)]
    });

    bool.regions[1] = bool.regions[1].map( (bp, bpi) => {
        return [Number(bp[0])+Number(tangent.x), Number(bp[1])+Number(tangent.y)]
    });
    
    return bool;
}

export const destroy_poly = (cx: CanvasRenderingContext2D, poly: [[number[]]], force: number) => {
    
    let bounds = get_bounds(poly);

    let rot = new Vec(0, -1).rotate((Math.PI*2) * Math.random(), true);

    let _dir = new Vec(rot.x, rot.y);
    let _pos = new Vec(bounds.center[0], bounds.center[1]);

    let _to = _pos.plusNew(_dir.multiplyNew(9999));
    let _from = _pos.minusNew(_dir.multiplyNew(9999));

    let _normal = _dir.normalise().rotate(Math.PI/2, true);
    // let _normal = _dir.normalise().rotate(Math.PI/2, true).multiplyEq(0.5);

    let divider = [
        [_from.x-(_normal.x*force), _from.y-(_normal.y*force)],
        [_to.x-(_normal.x*force), _to.y-(_normal.y*force)],
        [_to.x+(_normal.x*force), _to.y+(_normal.y*force)],
        [_from.x+(_normal.x*force), _from.y+(_normal.y*force)]
    ];

    let bool = polybool.difference(
        { regions: [poly], inverted: false },
        { regions: [divider], inverted: false }
    );
    
    return bool;
}

export const scanlines = (cx: CanvasRenderingContext2D, poly: [number[]] ) => {

    let lines = [];
    let bounds = get_bounds(poly);
    let pos = new Vec(bounds.pos[0], bounds.pos[1]);
    let center = new Vec(bounds.center[0], bounds.center[1]);
    let diag = new Vec(bounds.size[0], bounds.size[1]);
    let tangent = new Vec(diag.x, diag.y).normalise().rotate(Math.PI/2, true);
    let dir = new Vec(0, -1).rotate(Math.random() * (Math.PI*2), true);
    let length = diag.magnitude();
    let force = 1;
    let res = 3;
    let inc = diag.normalise().multiplyNew(res);

    let _to = pos.plusNew(tangent.multiplyNew(9999));
    let _from = pos.minusNew(tangent.multiplyNew(9999));        

    for ( var i = 0, l = length; i<l; i+= res) {
        _to.plusEq(inc);
        _from.plusEq(inc);

        let l = [
            [_from.x, _from.y-(tangent.y*force)],
            [_to.x, _to.y-(tangent.y*force)],
            [_to.x, _to.y+(tangent.y*force)],
            [_from.x, _from.y+(tangent.y*force)],
            [_from.x, _from.y-(tangent.y*force)]
        ];
        lines.push(l);
    }

    let bool = polybool.difference(
        { regions: lines, inverted: false },
        { regions: [poly], inverted: true }
    );
    return bool;
};

export const angled_scanlines = (cx: CanvasRenderingContext2D, poly: [number[]], angle: number ) => {

    let lines = [];
    let bounds = get_bounds(poly);
    let pos = new Vec(bounds.pos[0], bounds.pos[1]);
    let center = new Vec(bounds.center[0], bounds.center[1]);
    let diag = new Vec(bounds.size[0], bounds.size[1]);
    let tangent = new Vec(diag.x, diag.y).normalise().rotate(Math.PI/2, true);
    let dir = new Vec(0, -1).rotate(Math.random() * (Math.PI*2), true);
    let length = diag.magnitude();
    let force = 1;
    let res = 5;
    let inc = diag.normalise().multiplyNew(res);

    let _to = pos.plusNew(tangent.multiplyNew(9999));
    let _from = pos.minusNew(tangent.multiplyNew(9999));        

    for ( var i = 0, l = length; i<l; i+= res) {
        _to.plusEq(inc);
        _from.plusEq(inc);

        let l = [
            [_from.x, _from.y-(tangent.y*force)],
            [_to.x, _to.y-(tangent.y*force)],
            [_to.x, _to.y+(tangent.y*force)],
            [_from.x, _from.y+(tangent.y*force)],
            [_from.x, _from.y-(tangent.y*force)]
        ];
        lines.push(l);
    }

    let bool = polybool.difference(
        { regions: lines, inverted: false },
        { regions: [poly], inverted: true }
    );
    return bool;
};


/**
 * Ascertain which end of the path we are on.
 * If the first few items are very close together, it means we are on the circle path we want to snip off.
 */
export const sample_paths = (cx, paths, threshold) => {

    let length = paths.length;
    let lengths = [];
    let cutoff = null;
    let circle_mag = '3.01593';
    let res = [];

    paths.map( (path, path_index) => {
        let start = magnitude(path[0], path[1]).toFixed(5);
        let end = magnitude(path[path.length-1], path[path.length-2]).toFixed(5);

        if (start === circle_mag) {
            res.push(path);
        } else {
            res.push(path.reverse());
        }
    });

    let clipped = [];

    res.map( (r, ri) => {
        let fucked = false;
        
        r.map( (rx, rxi) => {
            if (!fucked) {
                if (magnitude(rx, r[rxi+1]).toFixed(5) !== circle_mag) {
                    fucked = true;
                    clipped.push(r.slice(rxi, (r.length) ));
                }
            }
        });
    });

    return clipped;
}

export const hull_lsystem = (scheme) => {
    let pts = [];
    let prev = null;
    scheme.map( p => {
        if (!prev) {
        } else {
            pts.push([[prev[0], prev[1]], [p[0], p[1]]]);
        }
        prev = p;
    });
    pts.push([[prev[0], prev[1]], [scheme[0][0], scheme[0][1]]]);
    return pts;
}

export const flip_lsystem = (scheme, flip) => {
    return scheme.map( (p, i) => {
        return [p[0]*flip[0], p[1]*flip[1]];
    });
}

export const lsystem = (origin, orientation, scheme) => {

    /**
     * Scheme = 
     * [0, 100],
     * [-10, -20],
     * [10, -80]
     */

    let dir = new Vec(0, -1);
    let pos = new Vec(origin[0], origin[1]);
    let pts = [[origin[0], origin[1]]];

    scheme.map( (p, i) => {
        let f = new Vec(p[0], p[1]).rotate(orientation, true);
        pos.minusEq(f);
        // let angle = f.angle(true);
        // let magnitude = f.magnitude();
        // console.log(f, angle, magnitude);
        pts.push([pos.x, pos.y]);
    });

    return pts;
}

const arr_intersection = (a, b) => {

}
const poly_intersection = (a, b) => {

}

export const intersection = (a, b) => {
    let [x1, y1, x2, y2] = a,
        [x3, y3, x4, y4] = b;
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
        return false
    }

    const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1))

    // Lines are parallel
    if (denominator === 0) {
        return false
    }

    let ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator
    let ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator

    // Return a object with the x and y coordinates of the intersection
    let x = x1 + ua * (x2 - x1)
    let y = y1 + ua * (y2 - y1)

    return { x, y }
}

// const intersection = (ax, ay, bx, by, cx, cy, dx, dy) => {
// export const intersection = (a, b) => {
//     let [ax, ay, bx, by] = a;
//     let [cx, cy, dx, dy] = b;
//   // ax, ay, bx, and by are the coordinates of the endpoints of one line segment
//   // cx, cy, dx, and dy are the coordinates of the endpoints of the other line segment
//   // returns [x, y], the coordinates of their intersection
//   // returns [NaN, NaN] if they do not intersect
//   let x, y;
//   if (ax === bx) {
//     x = ax;
//     y = cy + ((dy - cy) / (dx - cx)) * (ax - cx);
//   } else if (cx === dx) {
//     x = cx;
//     y = ay + ((by - ay) / (bx - ax)) * (cx - ax);
//   } else {
//     x =
//       (ay - cy + (cx * (dy - cy)) / (dx - cx) - (ax * (by - ay)) / (bx - ax)) /
//       ((dy - cy) / (dx - cx) - (by - ay) / (bx - ax));
//     y = ay + ((by - ay) * (x - ax)) / (bx - ax);
//   }
//   if (
//     ((ax <= x && x <= bx) || (bx <= x && x <= ax)) &&
//     ((ay <= y && y <= by) || (by <= y && y <= ay)) &&
//     ((cx <= x && x <= dx) || (dx <= x && x <= cx)) &&
//     ((cy <= y && y <= dy) || (dy <= y && y <= cy))
//   ) {
//     return [x, y];
//   }
//   return [0 / 0, 0 / 0];
// }

// We take l and we making it 0.001% smaller
// So we can check if this line was created by intersection.
// Add 0.1% of the vectors magnitude to the starting point, and remove the same amount from the end point.
export const shrink_line = (l) => {
    let a = new Vec(l[0], l[1]);
    let b = new Vec(l[2], l[3]);
    let c = a.minusNew(b);
    let mag = c.magnitude();
    let ang = c.angle(true);
    let adv_a = a.minusNew(c.multiplyNew(0.0001));
    let adv_b = a.minusNew(c.multiplyNew(0.9999));
    // console.log(l, [adv_a.x, adv_a.y, adv_b.x, adv_b.y]);
    return [adv_a.x, adv_a.y, adv_b.x, adv_b.y];
}

export const check_intersection = (a, b, cx) => {
    let shrunk_line_a = shrink_line(a);
    return checkIntersection(shrunk_line_a[0], shrunk_line_a[1], shrunk_line_a[2], shrunk_line_a[3], b[0], b[1], b[2], b[3]);
}

export const bool_poly = (lines, hulls, cx, clip_rule) => {
    
    let new_lines = [...lines];
    let fuck = [];
    let prog = 0;
    let c_index = 0;
    let c_length = new_lines.length;

    hulls.map( (hpt, hindex) => {
        hpt.map( (lpt, lindex) => {
            c_index = 0;
            while (c_index < c_length ) {
                let line_a = [new_lines[c_index][0][0], new_lines[c_index][0][1], new_lines[c_index][1][0], new_lines[c_index][1][1]];
                let line_b = [lpt[0][0], lpt[0][1], lpt[1][0], lpt[1][1]];

                let sect = check_intersection(line_a, line_b, cx);
                if (sect.type === 'none') {
                    c_index++;
                } else {
                    if (sect.type !== 'parallel') {
                        let shrunk_a = shrink_line([line_a[0], line_a[1], sect.point.x, sect.point.y]);
                        let shrunk_b = shrink_line([sect.point.x, sect.point.y, line_a[2], line_a[3]]);
                        new_lines[c_index] = [[shrunk_a[0], shrunk_a[1]], [shrunk_a[2], shrunk_a[3]]];
                        new_lines.splice(c_index+1, 0, [[shrunk_b[0], shrunk_b[1]], [shrunk_b[2], shrunk_b[3]]]);
                        c_length++;
                        c_index++;
                    } else {
                        c_index++;
                    }
                }
            }
        });
    }); 

    let actual_new_lines = [];
    let hulls_poly = hulls.map( h => (h.map( hh => (hh[0]))));
    hulls_poly[0].push(hulls[0][0][0]);
    
    new_lines.map( nl => {
        let piss = true;
        if (clip_rule !== 'out') piss = false;
        let shrunk = shrink_line([nl[0][0], nl[0][1], nl[1][0], nl[1][1]]);
        
        let a = [shrunk[0], shrunk[1]];
        let b = [shrunk[2], shrunk[3]];

        hulls_poly.map( h => {
            if (clip_rule === 'out') {
                if (pip(a, h) || pip(b, h)) {
                    piss = false;
                }
            } else {
                if (pip(a, h) || pip(b, h)) {
                    piss = true;
                }
            }
        });

        if (piss) {
            actual_new_lines.push(nl);
        }
    });

    return actual_new_lines;
}

export const is_polyline = arr => {
    // Polylines take the following form
    [ // lines
        [ // line
            [x, y], [x, y] // points
        ]
    ]
}

export const sanitise_lines = (cx, polylines) => {
    
    /**
     * We are expecting an array of polylines
     * [ // lines
     *     [ // line
     *         [ [],[] ] // pt
     *     ]
     * ]
     */
    // console.log(`Number of polylines: ${polylines.length}`);

    let arr = [];
    let temp = [];
    let prev = null;
    let pt1 = [];
    let pt2 = [];

    //
    // -> Polylines
    // -> Polyline
    // -> Line
    // -> Point
    
    // console.log(polylines);

    polylines.map( (polyline, polyline_index) => {
        // A polyline will probably only be two points long.
        // cx.strokeStyle = 'blue';
        // cx.lineWidth = 30;
        polyline.map( (line, line_index) => {
            if (prev) {            
                if (magnitude(line[0], prev[1]) > 1) {
                    arr.push(temp);
                    temp = [];
                    temp.push(line[0])
                }
            } else {
                temp.push(line[0]);
            }             
            // draw_polyline(cx, line);
            temp.push(line[1]);             
            prev = [...line];
            // prev = [[line[0][0], line[0][1]], [line[1][0], line[1][1]]];
        });
    });
    arr.push(temp);
    // console.log(prev);
    // console.log(arr);
    // console.log(temp);
    // debugger;
    // temp.push(prev);
    // arr.push(temp);
    
    // cx.strokeStyle = 'red';
    // cx.lineWidth = 15;
    
    // console.log(arr);
    // debugger;
    // draw_polylines(cx, arr);
    // draw_polylines(cx, arr);
    // draw_polylines(cx, arr);
    // draw_polylines(cx, arr);
    // cx.strokeStyle = 'black';
    // cx.lineWidth = 1;
    return arr;
}

export const bool = (lines, hulls, cx, clip_rule) => {
    
    let new_lines = [...lines];
    let fuck = [];
    let prog = 0;
    let c_index = 0;
    let c_length = new_lines.length;

    hulls.map( (hpt, hindex) => {
        hull_lsystem(hpt).map( (lpt, lindex) => {
            c_index = 0;
            while (c_index < c_length ) {
                let splits = [];
                let line_a = [new_lines[c_index][0][0], new_lines[c_index][0][1], new_lines[c_index][1][0], new_lines[c_index][1][1]];
                let line_b = [lpt[0][0], lpt[0][1], lpt[1][0], lpt[1][1]];
                let sect = check_intersection(line_a, line_b);
                if (isNaN(sect[0])) {
                    c_index++;
                } else {
                    new_lines[c_index] = [[line_a[0], line_a[1]], [sect[0], sect[1]]];
                    new_lines.splice(c_index+1, 0, [[sect[0], sect[1]], [line_a[2], line_a[3]]]);
                    c_length++;
                    c_index+=2;
                }
            }
        });
    }); 

    let actual_new_lines = [];

    new_lines.map( nl => {
        let piss = true;
        if (clip_rule !== 'out') piss = false;
        let shrunk = shrink_line([nl[0][0], nl[0][1], nl[1][0], nl[1][1]]);

        let a = [shrunk[0], shrunk[1]];
        let b = [shrunk[2], shrunk[3]];

        // dot(cx, a, 1);
        // dot(cx, b, 1);

        hulls.map( h => {
            if (clip_rule === 'out') {
                if (pip(a, h) || pip(b, h)) {
                    piss = false;
                }
            } else {
                if (pip(a, h) || pip(b, h)) {
                    piss = true;
                }
            }
        });

        if (piss) {
            actual_new_lines.push(nl);
        }
    });

    return actual_new_lines;
}

export const rose = (cx, r, pos, multi, rnd) => {

    let hull = form_polygon(pos, r, 360, 0, 0);

    let pts = [
        hull.pts[0],
        hull.pts[45],
        hull.pts[90],
        hull.pts[135],
        hull.pts[180],
        hull.pts[225],
        hull.pts[270],
        hull.pts[315]
    ];  

    let vecs = [
        new Vec(hull.pts[0][0], hull.pts[0][1]),
        new Vec(hull.pts[45][0], hull.pts[45][1]),
        new Vec(hull.pts[90][0], hull.pts[90][1]),
        new Vec(hull.pts[135][0], hull.pts[135][1]),
        new Vec(hull.pts[180][0], hull.pts[180][1]),
        new Vec(hull.pts[225][0], hull.pts[225][1]),
        new Vec(hull.pts[270][0], hull.pts[270][1]),
        new Vec(hull.pts[315][0], hull.pts[315][1])
    ];

    let c = pos;
    let vc = new Vec(c[0], c[1]);
    
    let v = vc.minusNew(vecs[3]);
    let pp = vc.minusNew(v.multiplyEq(multi));
    let pl = [
        c,
        pts[4],
        [pp.x, pp.y],
        pts[2],
        c
    ];

    let tri1 = [
        [pl[1], pl[2]],
        [pl[2], pl[0]],
        [pl[0], pl[1]]
    ];

    // draw_polyline(cx, [pl[1], pl[2]]);
    // draw_polyline(cx, [pl[2], pl[0]]);
    // draw_polyline(cx, [pl[0], pl[1]]);

    v = vc.minusNew(vecs[5]);   
    pp = vc.minusNew(v.multiplyEq(multi));
    pl = [
        c,
        pts[6],
        [pp.x, pp.y],
        pts[4],
        c
    ];

    // draw_polyline(cx, [pl[1], pl[2]]);
    // draw_polyline(cx, [pl[2], pl[0]]);
    // draw_polyline(cx, [pl[0], pl[1]]);

    let tri2 = [
        [pl[1], pl[2]],
        [pl[2], pl[0]],
        [pl[0], pl[1]]
    ];

    v = vc.minusNew(vecs[1]);
    pp = vc.minusNew(v.multiplyEq(multi));
    pl = [
        c,
        pts[0],
        [pp.x, pp.y],
        pts[2],
        c
    ];

    let tri3 = [
        [pl[3], pl[2]],
        [pl[2], pl[0]],
        [pl[0], pl[3]]
    ];

    // draw_polyline(cx, [pl[3], pl[2]]);
    // draw_polyline(cx, [pl[2], pl[0]]);
    // draw_polyline(cx, [pl[0], pl[3]]);

    v = vc.minusNew(vecs[7]);
    pp = vc.minusNew(v.multiplyEq(multi));
    pl = [
        c,
        pts[0],
        [pp.x, pp.y],
        pts[6],
        c
    ];

    let tri4 = [
        [pl[1], pl[2]],
        [pl[2], pl[0]],
        [pl[0], pl[1]]
    ];

    // draw_polyline(cx, [pl[1], pl[2]]);
    // draw_polyline(cx, [pl[2], pl[0]]);
    // draw_polyline(cx, [pl[0], pl[1]]);

    let prev = null;
    let ordered = pl.map( fff => {
        if (prev) {
            let wank = [fff[0]-prev[0], fff[1]-prev[1]];
            prev = fff;
            return wank;
        } else {
            prev = fff;
            return [0, 0];
        }
    });

    let ls = lsystem(pos, rnd + 0, ordered);
    ls = lsystem(pos, rnd + Math.PI/2, ordered);
    ls = lsystem(pos, rnd + Math.PI*1.5, ordered);
    ls = lsystem(pos, rnd + Math.PI, ordered);
    ls = lsystem(pos, rnd + Math.PI/4, ordered);
    ls = lsystem(pos, rnd + -Math.PI/4, ordered);
    ls = lsystem(pos, rnd + -Math.PI-Math.PI/4, ordered);
    ls = lsystem(pos, rnd + -Math.PI+Math.PI/4, ordered);

    let lsystems = [
        lsystem(pos, rnd + 0, ordered),
        lsystem(pos, rnd + Math.PI/2, ordered),
        lsystem(pos, rnd + Math.PI*1.5, ordered),
        lsystem(pos, rnd + Math.PI, ordered),
        lsystem(pos, rnd + Math.PI/4, ordered),
        lsystem(pos, rnd + -Math.PI/4, ordered),
        lsystem(pos, rnd + -Math.PI-Math.PI/4, ordered),
        lsystem(pos, rnd + -Math.PI+Math.PI/4, ordered)
    ];

    let flower_a = [
        lsystem(pos, rnd + 0, ordered),
        lsystem(pos, rnd + Math.PI/2, ordered),
        lsystem(pos, rnd + Math.PI*1.5, ordered),
        lsystem(pos, rnd + Math.PI, ordered)
    ];

    let flower_b = [
        lsystem(pos, rnd + Math.PI/4, ordered),
        lsystem(pos, rnd + -Math.PI/4, ordered),
        lsystem(pos, rnd + -Math.PI-Math.PI/4, ordered),
        lsystem(pos, rnd + -Math.PI+Math.PI/4, ordered)
    ];

    let manifold_a = [];
    manifold_a.push(
        flower_a[0][2], flower_a[0][3], flower_a[0][4],
        flower_a[1][2], flower_a[1][3], flower_a[1][4],
        flower_a[3][2], flower_a[3][3], flower_a[3][4],
        flower_a[2][2], flower_a[2][3], flower_a[2][4],
    );

    let maprev = null;
    let manifold_a_polyline = manifold_a.map( (b, bi) => {
        if (manifold_a[bi+1]) {
            return [[b[0], b[1]], [manifold_a[bi+1][0], manifold_a[bi+1][1]]];
        } else {
            return [[b[0], b[1]], [manifold_a[0][0], manifold_a[0][1]]];
        }
    });

    let manifold_b = [];
    manifold_b.push(
        flower_b[0][2], flower_b[0][3], flower_b[0][4],
        flower_b[2][2], flower_b[2][3], flower_b[2][4],
        flower_b[3][2], flower_b[3][3], flower_b[3][4],
        flower_b[1][2], flower_b[1][3], flower_b[1][4],
    );

    let mbprev = null;
    let manifold_b_polyline = manifold_b.map( (b, bi) => {
        if (manifold_b[bi+1]) {
            return [[b[0], b[1]], [manifold_b[bi+1][0], manifold_b[bi+1][1]]];
        } else {
            return [[b[0], b[1]], [manifold_b[0][0], manifold_b[0][1]]];
        }
    });

    return {
        vecs,
        lsystems,
        flower_a,
        flower_b,
        manifold_a,
        manifold_b,
        manifold_a_polyline,
        manifold_b_polyline,
        tri1,
        tri2,
        tri3,
        tri4
    };
}

export const gen_rose = (cx, pos, rad, div, size, rot) => {
        
    let pts = [];
    let lines = [];
    let edge = [];
    let cc = form_polygon(pos, rad, 720, rot);
    cc.pts.push(cc.pts[0]);
    let ccf = form_polygon(pos, rad*size, 720, rot);
    ccf.pts.push(ccf.pts[0]);

    for ( var i = 0; i<div; i++) {
        let cp0 = cc.pts[0 + (i*(720/div))];
        let cp2 = cc.pts[(720/div) + (i*(720/div))];
        let cp1 = ccf.pts[(720/(div*2)) + (i*(720/div))];
        pts.push(cp0, cp1);
        lines.push([cp0, cp1]);
        if (i === div-1) {
            pts.push(cc.pts[0]);
            lines.push([cp1, cc.pts[0]]);
        } else {
            lines.push([cp1, cp2]);
        }
    }

    return {
        pts,
        lines
    } 
}



