import { sendMessageToMCU, sendMessageToMCUThrottled } from '@/lib/mcu';
import { Command, EffectParameter, EffectType } from '@/types/wsTypes';
import { getColorFromBrightnessAndColdBrightness } from '@/utils/color';
import { ref, watch } from 'vue';

export interface EffectState {
	type: EffectType;
	duration: number;
	startLedIndex: number;
}

export interface State {
	brightness: number;
	coldBrightness: number;
	onEffect: EffectState;
	offEffect: EffectState;
}

export const stateChanged = ref(false);
export const state = ref<State>({
	brightness: 0,
	coldBrightness: 0,
	onEffect: {
		type: <EffectType>EffectType.NONE[0],
		duration: 0,
		startLedIndex: 0,
	},
	offEffect: {
		type: <EffectType>EffectType.NONE[0],
		duration: 0,
		startLedIndex: 0,
	},
});

export function setupStateWatchers() {
	watch(
		state,
		() => {
			stateChanged.value = true;
		},
		{ deep: true },
	);

	watch([() => state.value.brightness, () => state.value.coldBrightness], ([brightness, coldBrightness]) => {
		sendMessageToMCUThrottled(
			`${Command.SET_COLOR} ${getColorFromBrightnessAndColdBrightness(brightness, coldBrightness)}`,
		);
	});

	watch(
		() => state.value.onEffect.type,
		(newType) => {
			sendMessageToMCU(`${Command.SET_ON_EFFECT} ${newType}`);
			if (newType !== EffectType.NONE[0]) {
				sendMessageToMCU(
					`${Command.SET_ON_EFFECT_PARAMETER} ${EffectParameter.DURATION} ${state.value.onEffect.duration}`,
				);
			}
			if (newType === EffectType.LIGHTSABER[0]) {
				sendMessageToMCU(
					`${Command.SET_ON_EFFECT_PARAMETER} ${EffectParameter.START_LED_INDEX} ${state.value.onEffect.startLedIndex}`,
				);
			}
		},
	);

	watch(
		() => state.value.onEffect.duration,
		(newDuration) => {
			if (state.value.onEffect.type === EffectType.NONE[0]) return;

			sendMessageToMCUThrottled(`${Command.SET_ON_EFFECT_PARAMETER} ${EffectParameter.DURATION} ${newDuration}`);
		},
	);

	watch(
		() => state.value.onEffect.startLedIndex,
		(newStartLedIndex) => {
			if (state.value.onEffect.type !== EffectType.LIGHTSABER[0]) return;

			sendMessageToMCUThrottled(
				`${Command.SET_ON_EFFECT_PARAMETER} ${EffectParameter.START_LED_INDEX} ${newStartLedIndex}`,
			);
		},
	);

	watch(
		() => state.value.offEffect.type,
		(newType) => {
			sendMessageToMCU(`${Command.SET_OFF_EFFECT} ${newType}`);
			if (newType !== EffectType.NONE[0]) {
				sendMessageToMCU(
					`${Command.SET_OFF_EFFECT_PARAMETER} ${EffectParameter.DURATION} ${state.value.offEffect.duration}`,
				);
			}
			if (newType === EffectType.LIGHTSABER[0]) {
				sendMessageToMCU(
					`${Command.SET_OFF_EFFECT_PARAMETER} ${EffectParameter.START_LED_INDEX} ${state.value.offEffect.startLedIndex}`,
				);
			}
		},
	);

	watch(
		() => state.value.offEffect.duration,
		(newDuration) => {
			sendMessageToMCUThrottled(`${Command.SET_OFF_EFFECT_PARAMETER} ${EffectParameter.DURATION} ${newDuration}`);
		},
	);

	watch(
		() => state.value.offEffect.startLedIndex,
		(newStartLedIndex) => {
			sendMessageToMCUThrottled(
				`${Command.SET_OFF_EFFECT_PARAMETER} ${EffectParameter.START_LED_INDEX} ${newStartLedIndex}`,
			);
		},
	);
}
