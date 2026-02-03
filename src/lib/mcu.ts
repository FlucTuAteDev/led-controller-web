import { throttleQueue } from '@/utils/functions';
import { throttle } from 'lodash-es';

const WEBSOCKET_THROTTLE_MS = 100;
export const SEND_THROTTLE_MS = WEBSOCKET_THROTTLE_MS + 50;

const ws = new WebSocket('/ws');

ws.addEventListener('open', () => console.log('CONNECTED'));
ws.addEventListener('message', (e) => {
	console.log(e.data);
});

export const _sendMessageToMCU = (message: string) => {
	if (import.meta.env.DEV) {
		console.log(`sending message: ${message}`);
		return;
	}

	if (ws.readyState !== WebSocket.OPEN) {
		alert('Not connected yet to the MCU, wait a bit!');
		return;
	}
	ws.send(message);
};

// By just sending a message it will be queued, none of them are dropped
export const sendMessageToMCU = throttleQueue(_sendMessageToMCU, WEBSOCKET_THROTTLE_MS);
// Calling this might drop some messages
// + 50 is because if the same throttle time is applied then the queued messages pile up
export const sendMessageToMCUThrottled = throttle(sendMessageToMCU, WEBSOCKET_THROTTLE_MS + 50);
