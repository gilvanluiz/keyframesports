import * as t from 'io-ts';

const TypedDictV = t.record(t.string, t.record(t.string, t.string));
export type TypedDict = t.TypeOf<typeof TypedDictV>;

const TypedDictArrV = t.array(TypedDictV);
export type TypedDictArr = t.TypeOf<typeof TypedDictArrV>;

const NativeDictV = t.record(t.string, t.any);
const NativeDictArrV = t.array(NativeDictV);
export type NativeDictArr = t.TypeOf<typeof NativeDictArrV>;

export { TypedDictV, NativeDictArrV, TypedDictArrV };
