import { Types as tsruntimeTypes } from 'tsruntime';
import { types } from '../../../types';
export declare class CompositeTypeConverter implements types.TypeConverter {
    private converters;
    constructor(converters?: types.TypeConverter[]);
    isConvertible(reflectedType: tsruntimeTypes.ReflectedType): boolean;
    add(converter: types.TypeConverter, atIndex?: number): void;
    remove(converter: types.TypeConverter): boolean;
    removeAt(index: number): types.TypeConverter | undefined;
    private sortByPriority;
    convert(reflectedType: tsruntimeTypes.ReflectedType, converter: types.Converter): types.Type;
    reflect(reflectedType: tsruntimeTypes.ReflectedType, converter: types.Converter): types.Type;
    private findApplicableConverter;
    getConverters(): readonly types.TypeConverter[];
    size(): number;
}
