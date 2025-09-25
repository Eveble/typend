import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Class } from '../../../patterns/class';
export declare class TypeOfConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType, converter: types.Converter): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType, converter: types.Converter): Class;
    reflect(reflectedType: tsruntimeTypes.ReflectedType, converter: types.Converter): Record<keyof any, any>;
}
