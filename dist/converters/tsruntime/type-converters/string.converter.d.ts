import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { InstanceOf } from '../../../patterns/instance-of';
export declare class StringConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType): InstanceOf;
    reflect(reflectedType: tsruntimeTypes.ReflectedType): typeof String;
}
