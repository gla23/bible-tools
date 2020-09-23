export function invertObject<O extends { [index: string]: number | string }>(
  object: O
): {
  [index: string]: string;
} {
  const ret: { [index: string]: string } = {};
  Object.keys(object).forEach((key) => {
    ret[object[String(key)]] = key;
  });
  return ret;
}
