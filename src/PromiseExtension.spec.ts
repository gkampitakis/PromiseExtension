import PromiseUtil from './PromiseExtension';

describe('PromiseExtension', () => {
	const callbackSpy = jest.fn(),
		delay = (time, item = null, error = false) =>
			new Promise((resolve: any) => {
				callbackSpy(item);
				if (error) throw new Error('Unexpected Error');
				return setTimeout(resolve(item), time);
			});

	beforeEach(() => {
		callbackSpy.mockClear();
	});

	describe('Props', () => {
		it('Should return a resolved object', async () => {
			const object = {
				test: delay(1000, 'test'),
				test1: delay(1000, 'test'),
				test2: delay(1000, 'test'),
				test3: delay(1000, 'test')
			};

			const result = await PromiseUtil.props(object);

			expect(result).toEqual({
				test: 'test',
				test1: 'test',
				test2: 'test',
				test3: 'test'
			});
		});

		it('Should throw error if no object provided', async () => {
			try {
				await PromiseUtil.props([]);
			} catch (error) {
				expect(error.message).toBe('Promise.props only accepts object');
			}
		});
	});

	describe('Map', () => {
		it('Should apply the callback to all elements and resolve', async () => {
			const result = await PromiseUtil.map(['1', '2', '3', '4'], (value) => delay(5000, value), {
				concurrency: 2
			});

			expect(result.length).toBe(4);
			expect(callbackSpy).toHaveBeenCalledTimes(4);
			expect(callbackSpy).toHaveBeenCalledWith('1');
			expect(callbackSpy).toHaveBeenCalledWith('2');
			expect(callbackSpy).toHaveBeenCalledWith('3');
			expect(callbackSpy).toHaveBeenCalledWith('4');
		});

		it('Should apply the callback to all elements and resolve', async () => {
			const result = await PromiseUtil.map([1, 2, 3, 4], (value) => delay(5000, value));

			expect(result.length).toBe(4);
			expect(callbackSpy).toHaveBeenCalledTimes(4);
			expect(callbackSpy).toHaveBeenCalledWith(1);
			expect(callbackSpy).toHaveBeenCalledWith(2);
			expect(callbackSpy).toHaveBeenCalledWith(3);
			expect(callbackSpy).toHaveBeenCalledWith(4);
		});

		it('Should reject error', () => {
			return PromiseUtil.map(['1', '2', '3', '4'], (value) => delay(5000, value, true), {
				concurrency: 2
			}).catch((error) => {
				expect(error.message).toBe('Unexpected Error');
			});
		});
	});

	describe('Each', () => {
		it('Should call the callback and resolve', async () => {
			const callbackSpy = jest.fn();

			return PromiseUtil.each(['1', Promise.resolve('2'), 3, delay(5000, '4')], (value, index, length) => {
				callbackSpy(value, index, length);
			}).then((res) => {
				expect(res).toEqual(['1', '2', 3, '4']);
				expect(callbackSpy).toHaveBeenCalledTimes(4);
				expect(callbackSpy).toHaveBeenCalledWith('1', 0, 4);
				expect(callbackSpy).toHaveBeenCalledWith('2', 1, 4);
				expect(callbackSpy).toHaveBeenCalledWith(3, 2, 4);
				expect(callbackSpy).toHaveBeenCalledWith('4', 3, 4);
			});
		});

		it('Should reject error', () => {
			return PromiseUtil.each(['1', Promise.resolve('2'), 3, delay(5000, '4')], (value) =>
				Promise.reject(new Error('MockError'))
			).catch((error) => {
				expect(error.message).toBe('MockError');
			});
		});

		it('Should reject error', () => {
			const callbackSpy = jest.fn();

			return PromiseUtil.each(
				['1', Promise.resolve(2), Promise.reject(new Error('MockError')), 3, delay(5000, '4')],
				(value, index, length) => {
					callbackSpy(value, index, length);
				}
			).catch((error) => {
				expect(error.message).toBe('MockError');
				expect(callbackSpy).toHaveBeenCalledTimes(2);
			});
		});
	});

	describe('delay', () => {
		it('Should call the callback and resolve', () => {
			const callbackSpy = jest.fn();

			return PromiseUtil.delay(100, callbackSpy).then(() => {
				expect(callbackSpy).toHaveBeenCalledTimes(1);
			});
		});

		it('Should call the callback and resolve', () => {
			return PromiseUtil.delay(100).then((res) => {
				expect(res).toBeUndefined();
			});
		});

		it('Should reject error', () => {
			return PromiseUtil.delay(100, () => Promise.reject(new Error('MockError'))).catch((error) => {
				expect(error.message).toBe('MockError');
			});
		});
	});
});
