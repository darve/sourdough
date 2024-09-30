
import {
	EasingType,
	EasingFunctions
} from './easing';

export type TransitionProps = [number, number[], number[], number, EasingType, Function, Function];

class Transition {
	progress: number;
	duration: number;
	start: number[];
	finish: number[];
	dead: boolean;
	ease: Function;
	step: Function;
	cb: Function;

	// Arguments are in array form so we can instantiate transitions in an aesthetic way.
	constructor(props: TransitionProps) {
		
		this.progress = 0 - props[3];
		this.duration = props[0];
		this.start = props[1];
		this.ease = EasingFunctions[props[4]];
		this.finish = props[2];
		this.step = props[5];
		this.dead = false;
		this.cb = props[6];
	}

	async tick(cx: CanvasRenderingContext2D, asset_cache: Map<string, any>) {
		return new Promise(async r => {
			
			if (this.progress >= 0) {
				let vals: number[] = [];
				this.start.map( (val, index) => {
					vals.push(this.ease( this.progress, 0, this.finish[index] - this.start[index], this.duration ) + this.start[index]);
				});
				await this.step(cx, asset_cache, vals);
			}

		    this.progress++;

		    if (this.progress === this.duration) {
		        this.dead = true;
		        if (this.cb) this.cb();
		    }

			r(undefined);
		});
	}
}

export default Transition;