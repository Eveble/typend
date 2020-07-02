import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { InstanceOf } from '../../../patterns/instance-of';
export declare class PrimitiveConverter implements types.TypeConverter {
    static MAPPINGS: Record<number, any>;
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType): InstanceOf;
    reflect(reflectedType: tsruntimeTypes.ReflectedType): string | number | boolean | symbol;
}
