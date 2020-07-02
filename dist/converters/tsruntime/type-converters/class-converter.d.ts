import 'reflect-metadata';
import { Types as tsrTypes } from 'tsruntime';
import { types } from '../../../types';
import { Class } from '../../../patterns/class';
export declare class ClassConverter implements types.TypeConverter {
    transformers: Map<string, types.TypeTransformer>;
    constructor(transformers?: Map<string, types.TypeTransformer>);
    isConvertible(reflectedTypeOrClass: tsrTypes.ReflectedType | any): boolean;
    convert(reflectedType: (tsrTypes.ReflectedType | tsrTypes.ReferenceType | tsrTypes.ClassType) | types.Class, converter: types.Converter): Class | any;
    reflect(reflectedType: (tsrTypes.ReflectedType | tsrTypes.ReferenceType | tsrTypes.ClassType) | types.Class, converter: types.Converter): Record<keyof any, any>;
    protected resolveProperties(type: types.Class, converter: types.Converter, isConverted: boolean): Record<keyof any, any>;
    protected resolveType(reflectedType: tsrTypes.ReflectedType | types.Class): types.Class;
    protected isCached(type: types.Class, isConverted: boolean): boolean;
    protected resolveCached(type: types.Class, isConverted: boolean): Record<keyof any, any>;
    protected reflectClassType(type: types.Class): tsrTypes.ClassType;
    protected isReflectedReference(reflectedType: tsrTypes.ReflectedType): boolean;
    protected isReflectedClass(reflectedType: tsrTypes.ReflectedType): boolean;
    protected resolveParentProperties(type: types.Class, converter: types.Converter, isConverted: boolean): Record<keyof any, any>;
    protected transformType(classType: Class): Class;
    protected cacheProperties(type: types.Class, properties: types.Type, isConverted: boolean): void;
    protected getCacheMetadataKey(isConverted: boolean): symbol;
}
