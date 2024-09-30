export const gen = (paths: [number, number][][], colours: string[], stroke: string): string => {
	let output = ``;
	paths.forEach((p, i) => {
		let d = ``;
		p.forEach((pt, index) => {
			if (index === 0) d += `M${pt[0].toFixed(2)} ${pt[1].toFixed(2)} `;
			else d += `L${pt[0].toFixed(2)} ${pt[1].toFixed(2)} `;
		});
		output += `<path d="${d}" stroke="${colours[i]}" stroke-width="${stroke}"/>`;
	});
	return output;
}

export const wrap = (paths: string[], width: number, height: number) => {
	let start = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">`;
	let end = `</svg>`;
	return `${start}${paths}${end}`;	
}