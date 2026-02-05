import type { State } from '@/store/state';
import { EffectType } from '@/types/wsTypes';
import { getBrightnessAndColdBrightnessFromColor } from '@/utils/color';

export function getInitialState(): Promise<State> {
	if (import.meta.env.DEV) {
		return getDummyInitialState();
	}

	return getInitialStateFromMCU();
}

function getDummyInitialState(): Promise<State> {
	return new Promise((res) =>
		setTimeout(() => {
			res({
				brightness: 255,
				coldBrightness: 128,
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

async function getInitialStateFromMCU(): Promise<State> {
	const res = await fetch('/api/state');
	if (!res.ok) throw new Error("Couldn't connect to api!");

	const result = await res.text();

	return parseInitialState(result);
}

function parseInitialState(initialStateText: string): State {
	const states = initialStateText.split(' ');

	const color = BigInt(states[0]!);

	return {
		...getBrightnessAndColdBrightnessFromColor(color),
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
