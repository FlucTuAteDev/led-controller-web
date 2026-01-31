export function roundDownToNearest(value: number, nearest: number) {
	return Math.floor(value / nearest) * nearest;
}

export function lerp(start: number, end: number, t: number) {
	return Math.round(start + (end - start) * t);
}
