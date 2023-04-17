/* Handles conversions from xM API to natural JS types.

   For instance, many dictionaries come back in the form
   -> {'prop-name': 'vString', 'someinfo'}
   And we just want -> {'prop-name': 'someinfo'}
 */
import { keys, values } from 'ramda';
import { left } from 'fp-ts/lib/Either';
import {
    TypedDict,
    TypedDictArr,
    NativeDictArrV,
} from './DataTypeConversion.types';

const typeTable = {
    vString: String,
    vBoolean: Boolean,
    vDateTime: Date,
};

export function fromXMType(dict: TypedDict): any {
    try {
        return keys(dict)
            .map((name) => ({
                name,
                spec: keys(dict[name])[0],
                val: values(dict[name])[0],
            }))
            .map((obj) => ({
                name: obj.name,
                value: typeTable[obj.spec](obj.val),
            }))
            .reduce(
                (accum, currObj) => ({
                    ...accum,
                    [currObj.name]: currObj.value,
                }),
                {}
            );
    } catch (error) {
        return left(error);
    }
}

export function fromXMTypeArr(dictArr: TypedDictArr) {
    const rawResult = dictArr.map(fromXMType);
    return NativeDictArrV.decode(rawResult);
}
