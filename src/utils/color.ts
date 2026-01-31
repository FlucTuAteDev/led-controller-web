export const getColorFromBrightnessAndColdBrightness = (brightness: number, coldBrightness: number): number => {
	const warmBrightness = brightness - coldBrightness;

	return (coldBrightness << 16) | (warmBrightness << 8);
};

export const getBrightnessAndColorTemperatureFromColor = (color: bigint) => {
	const coldBrightness = Number((color >> 16n) & 0xffn);
	const warmBrightness = Number((color >> 8n) & 0xffn);
	const brightness = coldBrightness + warmBrightness;

	return { brightness, coldBrightness };
};
