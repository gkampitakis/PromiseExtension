function isArray (a): boolean {
  return Array.isArray(a);
}

function isObject (o): boolean {
  return !!o && o.constructor === Object;
}

function chunkArray (a: Array<any>, chunkSize = 0): any[] {
  if (!isArray(a)) throw new Error('Provide an array');
  if (chunkSize === 0 || a.length <= chunkSize) return [a];
  const chunks: any = [];
  while (a.length) {
    chunks.push(a.splice(0, chunkSize));
  }
  return chunks;
}

export { isArray, isObject, chunkArray };
