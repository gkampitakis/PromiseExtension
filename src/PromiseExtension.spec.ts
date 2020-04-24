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

		it('Should reject error', async () => {
			try {
				await PromiseUtil.map(['1', '2', '3', '4'], (value) => delay(5000, value, true), { concurrency: 2 });
			} catch (error) {
				expect(error.message).toBe('Unexpected Error');
			}
		});
	});
});
