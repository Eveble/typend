import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Collection } from '../../../patterns/collection';
import { Interface } from '../../../patterns/interface';
export declare class ObjectConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ObjectType, converter: types.Converter): Collection | Interface;
    reflect(reflectedType: tsruntimeTypes.ObjectType, converter: types.Converter): Record<keyof any, any>;
    private resolveProperties;
    private isInterface;
}
