
import Vec from './vec';


/**
 * What kind of value are we expecting for progress
 * A normal? i.e between 0 and 1 ?
 * A progress point is only useful if we have a length to go with it.
 * Unless our start point is always zero, and our progress dictates
 * how far along the line we should draw.
 *
 *  0.0. ===> 1.0.
 */
export const drawline = (f: number[], t: number[], progress: number) => {

    let start = new Vec(f[0], f[1]);
    let finish = new Vec(t[0], t[1]);

    let dir = start.minusNew(finish);
    let length = dir.magnitude();
    let angle = dir.normalise();

    let end_point = angle.multiplyNew(length*progress);

    // Return a start vector, and an end vector
    return [[start.x, start.y], [start.x-end_point.x, start.y-end_point.y]];
}

export const drawline_segment = (f: number[], t: number[], progress: number, start_progress: number) => {

    let start = new Vec(f[0], f[1]);
    let finish = new Vec(t[0], t[1]);

    let dir = start.minusNew(finish);
    let length = dir.magnitude();
    let angle = dir.normalise();

    let start_point = start.minusEq(angle.multiplyNew(length*start_progress));
    let end_point = angle.multiplyNew(length*progress);

    // Return a start vector, and an end vector
    return [[start_point.x, start_point.y], [start_point.x-end_point.x, start_point.y-end_point.y]];
}
