import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
import { Any } from '../../../patterns/any';
import { Void } from '../../../patterns/void';
import { Never } from '../../../patterns/never';
export declare class NativeConverter implements types.TypeConverter {
    static MAPPINGS: Record<number, any>;
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    convert(reflectedType: tsruntimeTypes.ReflectedType): Any | Void | Never;
    reflect(reflectedType: tsruntimeTypes.ReflectedType): Any | Void | Never;
}
