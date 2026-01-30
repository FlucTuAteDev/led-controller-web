export const getColorFromBrightnessAndColorTemperature = (brightness: number, colorTemperature: number): number => {
	const coldBrightness = colorTemperature === 0 ? 0 : brightness / (1 + (255 - colorTemperature) / colorTemperature);
	const warmBrightness = brightness - coldBrightness;

	return (Math.floor(coldBrightness) << 16) | (Math.floor(warmBrightness) << 8);
};
