export type Mutable<T> = {
  [P in keyof T]: T[P];
};

export type ObjectEntries<T> = T extends ArrayLike<infer U>
  ? [string, U][]
  : { [K in keyof T]: [K, T[K]] }[keyof T][];
