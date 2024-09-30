export const circle_pts = (center, radius, resolution, rotation = 0) => {

    let inc = (Math.PI*2)/resolution;
    let count = inc * rotation;
	let pts = [];

	for ( let i = 0; i<resolution; i++ ) {
		pts.push([
            radius*Math.sin(count) + center[0],
            radius*Math.cos(count)+center[1]
        ]);
		count += inc;
	}

	return pts;
}