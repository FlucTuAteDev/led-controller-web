export function roundDownToNearest(value: number, nearest: number) {
	return Math.floor(value / nearest) * nearest;
}
