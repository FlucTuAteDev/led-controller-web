// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function throttleQueue<T extends (...args: any[]) => any>(fn: T, delayMs: number) {
	const queue: Parameters<T>[] = [];
	let running = false;

	const processQueue = () => {
		if (running || queue.length === 0) return;

		running = true;
		const args = queue.shift()!;
		fn(...args);

		setTimeout(() => {
			running = false;
			processQueue();
		}, delayMs);
	};

	return (...args: Parameters<T>) => {
		queue.push(args);
		processQueue();
	};
}
