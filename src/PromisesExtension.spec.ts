import * as PromisesExtension from './PromisesExtension';

describe('PromiseExtension', () => {
  const callbackSpy = jest.fn(),
    delay = (time, item: any = null, error = false) =>
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
        test3: delay(5000, 'test'),
      };

      const result = await PromisesExtension.props(object);

      expect(result).toEqual({
        test: 'test',
        test1: 'test',
        test2: 'test',
        test3: 'test',
      });
    });

    it('Should return a resolved object even if its nested', async () => {
      const object = {
        test: delay(1000, 'test'),
        test1: delay(1000, 'test'),
        test2: delay(1000, 'test'),
        nested: {
          inner: {
            test3: delay(5000, 'test'),
          },
          test4: delay(5000, 'test'),
        },
      };

      const result = await PromisesExtension.props(object);

      expect(result).toEqual({
        test: 'test',
        test1: 'test',
        test2: 'test',
        nested: {
          inner: {
            test3: 'test',
          },
          test4: 'test',
        },
      });
    });

    it('Should resolve if no object provided', () => {
      return PromisesExtension.props([])
        .then((res) => {
          expect(res).toEqual([]);
        })
        .finally(() => expect.assertions(1));
    });

    it('Should resolve simple objects', async () => {
      const object = {
        arrayValues: ['123', 1, {}],
        object: {
          mock: 'value',
          nested: {}
        }
      };

      expect(await PromisesExtension.props(object)).toEqual(object);
    });
  });

  describe('Map', () => {
    it('Should apply the callback to all elements and resolve', async () => {
      const result = await PromisesExtension.map(
        ['1', '2', '3', '4'],
        (value) => delay(5000, value),
        {
          concurrency: 2,
        }
      );

      expect(result.length).toBe(4);
      expect(callbackSpy).toHaveBeenCalledTimes(4);
      expect(callbackSpy).toHaveBeenCalledWith('1');
      expect(callbackSpy).toHaveBeenCalledWith('2');
      expect(callbackSpy).toHaveBeenCalledWith('3');
      expect(callbackSpy).toHaveBeenCalledWith('4');
    });

    it('Should apply the callback to all elements and resolve', async () => {
      const result = await PromisesExtension.map([1, 2, 3, 4], (value) =>
        delay(5000, value)
      );

      expect(result.length).toBe(4);
      expect(callbackSpy).toHaveBeenCalledTimes(4);
      expect(callbackSpy).toHaveBeenCalledWith(1);
      expect(callbackSpy).toHaveBeenCalledWith(2);
      expect(callbackSpy).toHaveBeenCalledWith(3);
      expect(callbackSpy).toHaveBeenCalledWith(4);
    });

    it('Should reject error', () => {
      return PromisesExtension.map(
        ['1', '2', '3', '4'],
        (value) => delay(5000, value, true),
        {
          concurrency: 2,
        }
      ).catch((error) => {
        expect(error.message).toBe('Unexpected Error');
      });
    });
  });

  describe('Each', () => {
    it('Should call the callback and resolve', async () => {
      const callbackSpy = jest.fn();

      return PromisesExtension.each(
        ['1', Promise.resolve('2'), 3, delay(5000, '4')],
        (value, index, length) => {
          callbackSpy(value, index, length);
        }
      ).then((res) => {
        expect(res).toEqual(['1', '2', 3, '4']);
        expect(callbackSpy).toHaveBeenCalledTimes(4);
        expect(callbackSpy).toHaveBeenCalledWith('1', 0, 4);
        expect(callbackSpy).toHaveBeenCalledWith('2', 1, 4);
        expect(callbackSpy).toHaveBeenCalledWith(3, 2, 4);
        expect(callbackSpy).toHaveBeenCalledWith('4', 3, 4);
      });
    });

    it('Should reject error', () => {
      return PromisesExtension.each(
        ['1', Promise.resolve('2'), 3, delay(5000, '4')],
        (value) => Promise.reject(new Error('MockError'))
      )
        .catch((error) => {
          expect(error.message).toBe('MockError');
        })
        .finally(() => expect.assertions(1));
    });

    it('Should reject error', () => {
      const callbackSpy = jest.fn();
      return PromisesExtension.each(
        [
          '1',
          Promise.resolve(2),
          Promise.reject(new Error('MockError')),
          3,
          delay(5000, '4'),
        ],
        (value, index, length) => {
          callbackSpy(value, index, length);
        }
      )
        .catch((error) => {
          expect(error.message).toBe('MockError');
          expect(callbackSpy).toHaveBeenCalledTimes(2);
        })
        .finally(() => {
          expect.assertions(2);
        });
    });
  });

  describe('Delay', () => {
    it('Should call the callback after the delay and resolve', () => {
      const callbackSpy = jest.fn();

      jest.useFakeTimers();

      PromisesExtension.delay(2000, callbackSpy);

      expect(callbackSpy).toHaveBeenCalledTimes(0);

      jest.advanceTimersByTime(2000);

      expect(callbackSpy).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });

    it('Should call the callback before the delay and resolve', () => {
      const callbackSpy = jest.fn();

      jest.useFakeTimers();

      PromisesExtension.delay(2000, true, callbackSpy);

      expect(callbackSpy).toHaveBeenCalledTimes(1);

      jest.advanceTimersByTime(2000);

      expect(callbackSpy).toHaveBeenCalledTimes(1);

      jest.useRealTimers();
    });

    it('Should call the callback and resolve', () => {
      return PromisesExtension.delay(100).then((res) => {
        expect(res).toBeUndefined();
      });
    });

    it('Should call the callback and resolve', () => {
      return PromisesExtension.delay(100, true, () => Promise.resolve(1)).then(
        (res) => {
          expect(res).toBe(1);
        }
      );
    });

    it('Should reject error', () => {
      return PromisesExtension.delay(100, () =>
        Promise.reject(new Error('MockError'))
      ).catch((error) => {
        expect(error.message).toBe('MockError');
      });
    });

    it('Should reject error', () => {
      return PromisesExtension.delay(100, true, () =>
        Promise.reject(new Error('MockError'))
      ).catch((error) => {
        expect(error.message).toBe('MockError');
      });
    });
  });

  describe('AllSettled', () => {
    it('Should resolve with value', async () => {
      const value = await PromisesExtension.allSettled([Promise.resolve(5), Promise.resolve(10), Promise.resolve(20)])
      expect(value).toEqual([
        { status: 'fulfilled', value: 5 },
        { status: 'fulfilled', value: 10 },
        { status: 'fulfilled', value: 20 }
      ]);
    });

    it('Should resolve with reject reason', async () => {
      const value = await PromisesExtension.allSettled([Promise.reject('error'), Promise.reject('error2')])
      expect(value).toEqual([
        { status: 'rejected', reason: 'error' },
        { status: 'rejected', reason: 'error2' }
      ])
    });

    it('Support plain values', async () => {
      const value = await PromisesExtension.allSettled([Promise.resolve(5), 10, Promise.reject('error')])
      expect(value).toEqual([
        { status: 'fulfilled', value: 5 },
        { status: 'fulfilled', value: 10 },
        { status: 'rejected', reason: 'error' }
      ]);
    });
  });
});
