import { EffectType } from '@/types/wsTypes';

export interface InitialEffectState {
	type: EffectType;
	duration: number;
	startLedIndex: number;
}

export interface InitialState {
	brightness: number;
	colorTemperature: number;
	onEffect: InitialEffectState;
	offEffect: InitialEffectState;
}

export const initialStatePromise = getInitialState();

function getInitialState(): Promise<InitialState> {
	if (import.meta.env.DEV) {
		return getDummyInitialState();
	}

	return getInitialStateFromMCU();
}

function getDummyInitialState(): Promise<InitialState> {
	return new Promise((res) =>
		setTimeout(() => {
			res({
				brightness: 127,
				colorTemperature: 127,
				onEffect: {
					type: EffectType.LIGHTSABER[0],
					duration: 3000,
					startLedIndex: 0,
				},
				offEffect: {
					type: EffectType.LIGHTSABER[0],
					duration: 3000,
					startLedIndex: 0,
				},
			});
		}, 1000),
	);
}

async function getInitialStateFromMCU(): Promise<InitialState> {
	const res = await fetch('/api/state');
	if (!res.ok) throw new Error("Couldn't connect to api!");

	const result = await res.text();

	return parseInitialState(result);
}

function parseInitialState(initialStateText: string): InitialState {
	const states = initialStateText.split(' ');

	const color = Number(states[0]);
	const coldBrightness = (color >> 16) & 0xff;
	const warmBrightness = (color >> 8) & 0xff;
	const brightness = coldBrightness + warmBrightness;
	const colorTemperature = warmBrightness === 0 ? 255 : coldBrightness / warmBrightness;

	return {
		brightness,
		colorTemperature,
		onEffect: {
			type: Number(states[1]) as EffectType,
			duration: Number(states[2]),
			startLedIndex: Math.max(Number(states[3]), 0),
		},
		offEffect: {
			type: Number(states[4]) as EffectType,
			duration: Number(states[5]),
			startLedIndex: Math.max(Number(states[6]), 0),
		},
	};
}
