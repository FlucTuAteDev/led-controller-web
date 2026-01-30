import type { InitialState } from '@/config';
import type { InjectionKey } from 'vue';

export const initialStateInjectionKey: InjectionKey<InitialState> = Symbol('initial-state');
