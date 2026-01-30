import type { ObjectValues } from '@/utils/typeHelpers';

// export const RequestType = {
// 	GET: 0,
// 	SET: 1,
// } as const;
// export type RequestType = ObjectValues<typeof RequestType>;

// export const Command = {
// 	SET_BRIGHTNESS,
// 	SET_COLOR_TEMPERATURE,
// 	SET_ON_EFFECT,
// 	SET_OFF_EFFECT,
// 	SET_ON_EFFECT_PARAMETER,
// 	SET_OFF_EFFECT_PARAMETER,
// 	PREVIEW_ON_EFFECT,
// 	PREVIEW_OFF_EFFECT,
// 	SAVE,
// };

export interface InitialEffectData {
	type: EffectType;
	duration: number;
	startLedIndex?: number;
}

export interface InitialData {
	brightness: number;
	colorTemperature: number;
	onEffect: InitialEffectData;
	offEffect: InitialEffectData;
}

export const Command = {
	SET_COLOR: 0,
	SET_ON_EFFECT: 1,
	SET_OFF_EFFECT: 2,
	SET_ON_EFFECT_PARAMETER: 3,
	SET_OFF_EFFECT_PARAMETER: 4,
	PREVIEW_ON_EFFECT: 5,
	PREVIEW_OFF_EFFECT: 6,
	SAVE: 7,
} as const;
export type Command = ObjectValues<typeof Command>;

export const EffectParameter = {
	DURATION: 0,
	START_LED_INDEX: 1,
} as const;
export type EffectParameter = ObjectValues<typeof EffectParameter>;

export const EffectType = {
	NONE: [0, 'None'],
	LIGHTSABER: [1, 'Lightsaber'],
	FADE: [2, 'Fade'],
} as const;
export type EffectType = ObjectValues<typeof EffectType>[0];
