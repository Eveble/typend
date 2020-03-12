import { KINDS } from '../../../src/constants/literal-keys';
import { types } from '../../../src/types';
import { TSRuntimeConverter } from '../../../src/converters/tsruntime/tsruntime-converter';
import { ArrayConverter } from '../../../src/converters/tsruntime/type-converters/array-converter';
import { ClassConverter } from '../../../src/converters/tsruntime/type-converters/class-converter';
import { FunctionConverter } from '../../../src/converters/tsruntime/type-converters/function-converter';
import { NativeConverter } from '../../../src/converters/tsruntime/type-converters/native-converter';
import { NilConverter } from '../../../src/converters/tsruntime/type-converters/nil-converter';
import { ObjectConverter } from '../../../src/converters/tsruntime/type-converters/object-converter';
import { PrimitiveConverter } from '../../../src/converters/tsruntime/type-converters/primitive-converter';
import { ReferenceConverter } from '../../../src/converters/tsruntime/type-converters/reference-converter';
import { TupleConverter } from '../../../src/converters/tsruntime/type-converters/tuple-converter';
import { UnionConverter } from '../../../src/converters/tsruntime/type-converters/union-converter';
import { UnknownConverter } from '../../../src/converters/tsruntime/type-converters/unknown-converter';
import { UnrecognizedConverter } from '../../../src/converters/tsruntime/type-converters/unrecognized-converter';
import { LiteralConverter } from '../../../src/converters/tsruntime/type-converters/literal-converter';
import { PropsOfConverter } from '../../../src/converters/tsruntime/validation-converters/props-of-converter';
import { Describer } from '../../../src/describer';
import { DebugDescriber } from '../../../src/describers/debug-describer';
import { Pattern } from '../../../src/pattern';

const converter: types.Converter = new TSRuntimeConverter();
// Special converters
converter.registerConverter(KINDS.PROPERTIES_OF, new PropsOfConverter());
// Type converters
converter.registerConverter(KINDS.CLASS, new ClassConverter(new Map()));
converter.registerConverter(KINDS.TUPLE, new TupleConverter());
converter.registerConverter(KINDS.UNION, new UnionConverter());
converter.registerConverter(KINDS.NATIVE, new NativeConverter());
converter.registerConverter(KINDS.NIL, new NilConverter());
converter.registerConverter(KINDS.ARRAY, new ArrayConverter());
converter.registerConverter(KINDS.FUNCTION, new FunctionConverter());
converter.registerConverter(KINDS.OBJECT, new ObjectConverter());
converter.registerConverter(KINDS.PRIMITIVE, new PrimitiveConverter());
converter.registerConverter(KINDS.REFERENCE, new ReferenceConverter());
converter.registerConverter(KINDS.UNKNOWN, new UnknownConverter());
converter.registerConverter(KINDS.UNRECOGNIZED, new UnrecognizedConverter());
converter.registerConverter(KINDS.LITERAL, new LiteralConverter());

const describer = new Describer();
describer.registerDescriber('debug', new DebugDescriber());
describer.setFormatting('debug');
Pattern.setDescriber(describer);

export { converter };
