// import { KINDS } from '../../../src/constants/literal-keys';
import { types } from '../../../src/types';
import { TSRuntimeConverter } from '../../../src/converters/tsruntime/tsruntime-converter';

import { Describer } from '../../../src/describer';
import { DebugDescriber } from '../../../src/describers/debug-describer';
import { Pattern } from '../../../src/pattern';
import { CompositeTypeConverter } from '../../../src/converters/tsruntime/type-converters/composite.converter';
import { TypeKind } from '../../../src/enums/type-kind.enum';
import { PropsOfConverter } from '../../../src/converters/tsruntime/validation-converters/props-of-converter';
import { TypeOfConverter } from '../../../src/converters/tsruntime/validation-converters/type-of-converter';
import { ObjectConverter } from '../../../src/converters/tsruntime/type-converters/object.converter';
import { AnyConverter } from '../../../src/converters/tsruntime/type-converters/any.converter';
import { StringConverter } from '../../../src/converters/tsruntime/type-converters/string.converter';
import { NumberConverter } from '../../../src/converters/tsruntime/type-converters/number.converter';
import { BooleanConverter } from '../../../src/converters/tsruntime/type-converters/boolean.converter';
import { StringLiteralConverter } from '../../../src/converters/tsruntime/type-converters/string-literal.converter';
import { NumberLiteralConverter } from '../../../src/converters/tsruntime/type-converters/number-literal.converter';
import { FalseLiteralConverter } from '../../../src/converters/tsruntime/type-converters/false-literal.converter';
import { TrueLiteralConverter } from '../../../src/converters/tsruntime/type-converters/true-literal.converter';
import { EnumLiteralConverter } from '../../../src/converters/tsruntime/type-converters/enum-literal.converter';
import { ESSymbolConverter } from '../../../src/converters/tsruntime/type-converters/essymbol.converter';
import { VoidConverter } from '../../../src/converters/tsruntime/type-converters/void.converter';
import { NullConverter } from '../../../src/converters/tsruntime/type-converters/null.converter';
import { UndefinedConverter } from '../../../src/converters/tsruntime/type-converters/undefined.converter';
import { NeverConverter } from '../../../src/converters/tsruntime/type-converters/never.converter';
import { TupleConverter } from '../../../src/converters/tsruntime/type-converters/tuple.converter';
import { UnionConverter } from '../../../src/converters/tsruntime/type-converters/union.converter';
import { ClassConverter } from '../../../src/converters/tsruntime/type-converters/class.converter';
import { ReferenceConverter } from '../../../src/converters/tsruntime/type-converters/reference.converter';
import { UnknownConverter } from '../../../src/converters/tsruntime/type-converters/unknown.converter';
import { FunctionConverter } from '../../../src/converters/tsruntime/type-converters/function.converter';
import { ArrayConverter } from '../../../src/converters/tsruntime/type-converters/array.converter';

const converter: types.Converter = new TSRuntimeConverter();
// Converters
// Initialize Object as composite converter
const compositeObjectConverter = new CompositeTypeConverter();
converter.registerConverter(TypeKind.Object, compositeObjectConverter);

compositeObjectConverter.add(new PropsOfConverter(), 0);
compositeObjectConverter.add(new TypeOfConverter(), 1);
compositeObjectConverter.add(new ObjectConverter(), 2);

converter.registerConverter(TypeKind.Any, new AnyConverter());
converter.registerConverter(TypeKind.String, new StringConverter());
converter.registerConverter(TypeKind.Number, new NumberConverter());
converter.registerConverter(TypeKind.Boolean, new BooleanConverter());
converter.registerConverter(
  TypeKind.StringLiteral,
  new StringLiteralConverter()
);
converter.registerConverter(
  TypeKind.NumberLiteral,
  new NumberLiteralConverter()
);
converter.registerConverter(TypeKind.FalseLiteral, new FalseLiteralConverter());
converter.registerConverter(TypeKind.TrueLiteral, new TrueLiteralConverter());
converter.registerConverter(TypeKind.EnumLiteral, new EnumLiteralConverter());
converter.registerConverter(TypeKind.ESSymbol, new ESSymbolConverter());
converter.registerConverter(TypeKind.Void, new VoidConverter());
converter.registerConverter(TypeKind.Undefined, new UndefinedConverter());
converter.registerConverter(TypeKind.Null, new NullConverter());
converter.registerConverter(TypeKind.Never, new NeverConverter());
converter.registerConverter(TypeKind.Tuple, new TupleConverter());
converter.registerConverter(TypeKind.Union, new UnionConverter());
converter.registerConverter(TypeKind.Reference, new ReferenceConverter());
converter.registerConverter(TypeKind.Class, new ClassConverter());
converter.registerConverter(TypeKind.Unknown, new UnknownConverter());
converter.registerConverter(TypeKind.Function, new FunctionConverter());
converter.registerConverter(TypeKind.Array, new ArrayConverter());

const describer = new Describer();
describer.registerDescriber('debug', new DebugDescriber());
describer.setFormatting('debug');
Pattern.setDescriber(describer);

export { converter };
