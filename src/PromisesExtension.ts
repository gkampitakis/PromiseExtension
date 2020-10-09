import { chunkArray, isObject } from './utils';

async function props<T> (object: T): Promise<T> {
  if (!isObject(object)) return object;
  return Object.assign(
    {},
    ...(await Promise.all(
      Object.entries(object).map(async ([key, value]) => {
        if (Object.entries(value).length > 0)
          return { [key]: await props(value) };
        return { [key]: await value };
      })
    ))
  );
}

async function map<T> (
  array: Array<T>,
  callback: (param: T, index?: number) => any,
  { concurrency }: { concurrency: number } = { concurrency: 1 }
): Promise<Array<any>> {
  return new Promise(async (resolve, reject) => {
    const r: any[] = [],
      iterable = chunkArray(array, concurrency);

    for await (const chunk of iterable) {
      try {
        r.push(...(await Promise.all(chunk.map(callback))));
      } catch (e) {
        reject(e);
      }
    }
    resolve(r);
  });
}

async function each<T> (
  array: Array<T>,
  callback: (param: T, index?: number, length?: number) => any
): Promise<any> {
  return new Promise(async (resolve, reject) => {
    const r: any = [];
    try {
      for (let i = 0; i < array.length; i++) {
        const v = await array[i];
        await callback(v, i, array.length);
        r.push(v);
      }
      resolve(r);
    } catch (e) {
      reject(e);
    }
  });
}

async function delay (
  timer: number,
  order: boolean,
  callback: Function
): Promise<any>;
async function delay (timer: number, callback?: Function): Promise<any>;
async function delay (timer: number): Promise<any>;

async function delay (timer: any, order?: any, callback?: any) {
  const fn = typeof order === 'function' ? order : callback;
  const o = typeof order === 'boolean' ? order : false;

  return o
    ? new Promise(async (resolve, reject) => {
      try {
        const r = await fn();
        setTimeout(() => resolve(r), timer);
      } catch (e) {
        reject(e);
      }
    })
    : new Promise((resolve) =>
      setTimeout(() => resolve(fn ? fn() : undefined), timer)
    );
}

async function allSettled<T> (promises: (Promise<T> | T)[]) {
  return Promise.all(promises.map((v: any) => (
    v.then !== undefined ?
      v
        .then(d => ({
          status: 'fulfilled',
          value: d
        }))
        .catch(e => ({
          status: 'rejected',
          reason: e
        })) : {
        status: 'fulfilled',
        value: v
      }
  )));
}

export {
  map,
  props,
  each,
  delay,
  allSettled
};
