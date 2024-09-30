
import { line, dot, fill, magnitude, draw_polyline, draw_polylines, draw_split, split_poly, split_poly_from_center, destroy_poly, scanlines, colour_change, hex_to_rgba } from '../lib/crab';
import { createPath, pathsToPolylines, polylinesToSVG } from 'canvas-sketch-util/penplot';
import { Vec, Vec2 } from '../lib/vec';
import spline from '../lib/spline';
import { gen, wrap } from '../lib/svg';

type ClipProps = {
	cx: CanvasRenderingContext2D;
	ww: number;
	wh: number;
};

type ClipStateProps = {
	cx?: CanvasRenderingContext2D | null;
	pos?: [number, number] | null;
	pan?: [number, number] | null;
	start?: [number, number] | null;
	down?: boolean | null;
	framecount?: number | null;
};

type ClipReturn = {
	mount: Function;
	tick: Function;
};

export default (): ClipReturn => {

    const plots = [];
    const velocities = [];
    const forces = [];
    const prev: ClipStateProps = {};

	const mount = async (props: ClipProps): Promise<void> => new Promise(done => {
		Object.assign(prev, props);
		let { cx, ww, wh } = props;

		cx.imageSmoothingEnabled = true;
        cx.lineWidth = 6;
        cx.strokeStyle = '#000000';
        cx.lineCap = "round";
        cx.fillStyle = '#ffffff';
		cx.fillRect(0, 0, ww, wh);
		cx.fillStyle = '#000000';
		setTimeout(done, 100);
    });

	const tick = async (props: ClipProps): Promise<void> => new Promise(done => {
		const { cx, pos, pan, start, down, framecount } = prev;
		
		if (down) {
			cx?.fillRect(20, 20, 20, 20);
		}
		
		Object.assign(prev, props);
		setTimeout(done, 16);
	});

	return { mount, tick };
}