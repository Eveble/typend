import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { List } from '../../../patterns/list';
export declare class ArrayConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType, converter: types.Converter): List;
    reflect(reflectedType: tsruntimeTypes.ReflectedType, converter: types.Converter): any[];
}
