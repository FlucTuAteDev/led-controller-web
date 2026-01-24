import type { ObjectValues } from '@/utils/typeHelpers';

// export const RequestType = {
// 	GET: 0,
// 	SET: 1,
// } as const;
// export type RequestType = ObjectValues<typeof RequestType>;

export const LEDControllerParameter = {
	BRIGHTNESS: 0,
	COLOR_TEMPERATURE: 1,
	ON_EFFECT: 2,
	OFF_EFFECT: 3,
	ON_EFFECT_PARAMETER: 4,
	OFF_EFFECT_PARAMETER: 5,
} as const;
export type LEDControllerParameter = ObjectValues<typeof LEDControllerParameter>;

export const EffectParameter = {
	DURATION: 0,
	START_LED_INDEX: 1,
} as const;
export type EffectParameter = ObjectValues<typeof EffectParameter>;

export const EffectType = {
	NONE: [0, 'None'],
	LIGHTSABER: [1, 'Lightsaber'],
} as const;
export type EffectType = ObjectValues<typeof EffectType>[0];
