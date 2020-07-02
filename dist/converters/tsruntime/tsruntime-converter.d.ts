import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../types';
export declare class TSRuntimeConverter implements types.Converter {
    typeConverters: Map<string, types.TypeConverter>;
    constructor(typeConverters?: Map<string, types.TypeConverter>);
    convert(reflectedType: tsruntimeTypes.ReflectedType): types.Type;
    reflect(reflectedType: tsruntimeTypes.ReflectedType): types.Type;
    registerConverter(kind: string, typeConverter: types.TypeConverter, shouldOverride?: boolean): void;
    overrideConverter(kind: string, converter: types.TypeConverter): void;
    getConverter(type: string): types.TypeConverter | undefined;
    hasConverter(type: string): boolean;
    removeConverter(type: string): void;
}
