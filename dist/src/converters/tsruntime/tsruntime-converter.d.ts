import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../types';
import { Pattern } from '../../pattern';
import { TypeKind } from '../../enums/type-kind.enum';
export declare class TSRuntimeConverter implements types.Converter {
    typeConverters: Array<types.TypeConverter | undefined>;
    protected definitionCache: Map<any, types.TypeDefinition>;
    protected patternCache: Map<string, Pattern>;
    constructor(typeConverters?: Array<types.TypeConverter | undefined>);
    private findConverter;
    convert(reflectedType: tsruntimeTypes.ReflectedType): types.Type;
    createCacheKey(reflectedType: tsruntimeTypes.ReflectedType): string;
    reflect(reflectedType: tsruntimeTypes.ReflectedType): types.Type;
    registerConverter(kind: TypeKind, typeConverter: types.TypeConverter, shouldOverride?: boolean): void;
    overrideConverter(kind: TypeKind, converter: types.TypeConverter): void;
    getConverter(type: TypeKind): types.TypeConverter;
    hasConverter(type: TypeKind): boolean;
    removeConverter(type: TypeKind): void;
}
