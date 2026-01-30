import { throttle } from 'lodash-es';

export const WEBSOCKET_THROTTLE_MS = 100;

const ws = new WebSocket('/ws');

ws.addEventListener('open', () => console.log('CONNECTED'));
ws.addEventListener('message', (e) => {
	console.log(e.data);
});

export const sendMessageToMCU = (message: string) => {
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

export const sendMessageToMCUThrottled = throttle(sendMessageToMCU, WEBSOCKET_THROTTLE_MS, {
	leading: true,
	trailing: true,
});
