import 'reflect-metadata';
import { Types as tsrTypes } from 'tsruntime';
import { types } from '../../../types';
import { Collection } from '../../../patterns/collection';
import { Interface } from '../../../patterns/interface';
export declare class ObjectConverter implements types.TypeConverter {
    isConvertible(reflectedType: tsrTypes.ReflectedType): boolean;
    convert(reflectedType: tsrTypes.ObjectType, converter: types.Converter): Collection | Interface;
    reflect(reflectedType: tsrTypes.ObjectType, converter: types.Converter): Record<keyof any, any>;
    protected resolveProperties(reflectedType: tsrTypes.ObjectType, converter: types.Converter, isConverting: boolean): Record<keyof any, any>;
    isInterface(reflectedType: tsrTypes.ReflectedType): boolean;
}
