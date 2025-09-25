import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Collection } from '../../../patterns/collection';
export declare class PropsOfConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType, converter: types.Converter): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType, converter: types.Converter): Collection;
    reflect(reflectedType: tsruntimeTypes.ReflectedType, converter: types.Converter): Record<keyof any, any>;
}
