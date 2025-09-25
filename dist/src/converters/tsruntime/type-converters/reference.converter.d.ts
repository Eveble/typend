import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
export declare class ReferenceConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReferenceType, converter: types.Converter): any;
    reflect(reflectedType: tsruntimeTypes.ReferenceType, converter: types.Converter): any;
}
