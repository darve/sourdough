
import Vec from './vec';

export const form_circle = (center: number[], radius: number, resolution: number, rotation: number, line_split:number = 0) => {

    const inc = (Math.PI*2)/resolution;
    const pts: any = [];
    const lines = [];
    let count = 0;

    if ( rotation ) count = inc * rotation;

    for ( var i = 0; i<resolution; i++ ) {
        pts.push([
            radius*Math.sin(count) + center[0],
            radius*Math.cos(count) + center[1]
        ]);
        count += inc;
    }

    pts.map( (p,pi) => {
        if (pi === 0) {
            // Do fuck all mate.
        } else {
            lines.push([ pts[pi-1], p ]);
        }
    });

    lines.push([pts[pts.length-1], pts[0]]);

    let split_lines = [];

    if (line_split > 1) {

        split_lines = lines.map( (l, li) => {

            let A = new Vec(l[0][0], l[0][1]);
            let B = new Vec(l[1][0], l[1][1]);

            let split = [];
            let split_index = 0;

            let dir = A.minusNew(B).normalise();
            let mag = A.minusNew(B).magnitude();

            let len = mag / line_split;
            let inc = dir.multiplyNew(len);

            split.push([Number(A.x), Number(A.y)]);

            while (split_index < line_split-1) {
                A.minusEq(inc);
                split.push([Number(A.x), Number(A.y)]);
                split_index++;
            }
            return split;
        });
    }

    return {
        edge: [...pts, pts[0]],
        pts,
        lines,
        split_lines,
        meta: {
            radius, resolution, rotation, line_split
        }
    }
}

export const form_polygon = (center: number[], radius: number, resolution: number, rotation: number = 0, line_split: number = 0, scale: number[] = [1,1]) => {

    const inc = (Math.PI*2)/resolution;
    const pts = [];
    const lines = [];

    for ( var i = 0; i<resolution; i++ ) {
        pts.push([
            (radius*Math.sin(rotation))*scale[0] + center[0],
            (radius*Math.cos(rotation))*scale[1] + center[1]
        ]);
        rotation += inc;
    }

    pts.map( (p,i) => {
        if (i === 0) {
            // Do fuck all mate.
        } else {
            lines.push([ pts[i-1], p ]);
        }
    });

    lines.push([pts[pts.length-1], pts[0]]);

    let split_lines = [];

    if (line_split > 1) {

        split_lines = lines.map( (l, li) => {

            let A = new Vec(l[0][0], l[0][1]);
            let B = new Vec(l[1][0], l[1][1]);

            let split = [];
            let split_index = 0;

            let dir = A.minusNew(B).normalise();
            let mag = A.minusNew(B).magnitude();

            let len = mag / line_split;
            let inc = dir.multiplyNew(len);
            // debugger;
            let chuff = A.minusNew(inc);
            split.push([Number(A.x), Number(A.y), Number(chuff.x), Number(chuff.y)]);

            while (split_index <= line_split-1) {
                A.minusEq(inc);
                chuff = A.minusNew(inc);
                split.push([Number(A.x), Number(A.y), Number(chuff.x), Number(chuff.y)]);
                split_index++;
            }
            return split;
        });
    }

    return {
        edge: [...pts, pts[0]],
        pts,
        lines,
        split_lines,
        meta: {
            radius, resolution, rotation, line_split
        }
    }
}

export const form_polygons = (center: number[], radius: number[], resolution: number, stroke: number, spacing: number) => {
    let rings = [];
    for (var i = 0; i <= stroke; i++ ) {
        let f = form_polygon(center, (radius)+(spacing*i), resolution, 0, 0);
        rings.push(...f.lines);
    }
    return rings;
}

export const form_ring = (center: number[], radius: number[], resolution: number, stroke: number) => {
    let rings = [];
    for (var i = 1; i <= stroke; i++ ) {
        let f = form_polygon(center, (radius*2)+(i)-(stroke/2), resolution, 0, 0);
        rings.push(f.lines);
    }
    return rings;
}

export const form_scale = (center: number[], radius: number[], resolution: number, modulo: number = 5, config: number[], gap: number) => {
    let marks = [];
    
    let f1 = form_polygon(center, (radius*2)+(gap*2), resolution);
    let f2 = form_polygon(center, (radius*2)+(gap), resolution);
    let f3 = form_polygon(center, (radius*2)-(gap), resolution);
    let f4 = form_polygon(center, (radius*2)-(gap*2), resolution);

    f1.pts.map( (f, fi) => {
        if ( fi % modulo === 0 ) {
            marks.push([
                f1.pts[fi], f4.pts[fi],
                f4.pts[fi], f1.pts[fi]
            ]);
        } else {
            marks.push([
                f2.pts[fi], f3.pts[fi],
                f3.pts[fi], f2.pts[fi]
            ]);
        }
    });
    // console.log(marks);
    return marks;
}

export const form_rect = (center: number[], radius: number[], resolution: number, rotation: number, line_split: number = 0, scale: number[] = [1,1]) => {

    const inc = (Math.PI*2)/resolution;
    const pts = [];
    const lines = [];
    var count = 0;

    // if ( rotation ) 
        count = inc * rotation;

    for ( var i = 0; i<resolution; i++ ) {
        pts.push([
            (radius*Math.sin(count))*scale[0] + center[0],
            (radius*Math.cos(count))*scale[1] + center[1]
        ]);
        count += inc;
    }

    pts.map( (p,i) => {
        if (i === 0) {
            // Do fuck all mate.
        } else {
            lines.push([ pts[i-1], p ]);
        }
    });

    lines.push([pts[pts.length-1], pts[0]]);

    let split_lines = [];

    if (line_split > 1) {

        split_lines = lines.map( (l, li) => {

            let A = new Vec(l[0][0], l[0][1]);
            let B = new Vec(l[1][0], l[1][1]);

            let split = [];
            let split_index = 0;

            let dir = A.minusNew(B).normalise();
            let mag = A.minusNew(B).magnitude();

            let len = mag / line_split;
            let inc = dir.multiplyNew(len);
            // debugger;
            let chuff = A.minusNew(inc);
            split.push([Number(A.x), Number(A.y), Number(chuff.x), Number(chuff.y)]);

            while (split_index < line_split-1) {
                A.minusEq(inc);
                chuff = A.minusNew(inc);
                split.push([Number(A.x), Number(A.y), Number(chuff.x), Number(chuff.y)]);
                split_index++;
            }
            return split;
        });
    }

    return {
        edge: [...pts, pts[0]],
        pts,
        lines,
        split_lines,
        meta: {
            radius, resolution, rotation, line_split
        }
    }
}

// export const chainmail = (center: number[], radius: number, resolution: number, rows: number, spacing: number) => {

//     let lines = [];
//     let polys = [];

//     /**
//      * Generate inner one
//      * then outer ones
//      * two outers = 1 row.
//      */
//     for ( var i = 0; i < rows; i++) {

//     }

//     return 
// }

export const form_chainmail = (center: number[], radius: number, resolution: number, modulo: number = 5, config: number[], gap: number) => {
    let marks: any = [];
    
    let f1 = form_polygon(center, (radius*2)+(gap*2), resolution);
    let f2 = form_polygon(center, (radius*2)+(gap), resolution);
    let f3 = form_polygon(center, (radius*2)-(gap), resolution);
    let f4 = form_polygon(center, (radius*2)-(gap*2), resolution);

    f1.pts.map( (f, fi) => {
        if ( fi % modulo === 0 ) {
            marks.push([
                f1.pts[fi], f4.pts[fi],
                f4.pts[fi], f1.pts[fi]
            ]);
        } else {
            marks.push([
                f2.pts[fi], f3.pts[fi],
                f3.pts[fi], f2.pts[fi]
            ]);
        }
    });
    // console.log(marks);
    return marks;
}

