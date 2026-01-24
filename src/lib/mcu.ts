import { throttle } from 'lodash-es';

const ws = new WebSocket('/ws');

ws.addEventListener('open', () => console.log('CONNECTED'));
ws.addEventListener('message', (e) => {
	console.log(e.data);
});

export const sendMessageToMCU = throttle(
	(message: string) => {
		if (import.meta.env.DEV) {
			console.log(`sening message: ${message}`);
			return;
		}

		if (ws.readyState !== WebSocket.OPEN) {
			alert('Not connected yet to the MCU, wait a bit!');
			return;
		}
		ws.send(message);
	},
	100,
	{ leading: true, trailing: true },
);
